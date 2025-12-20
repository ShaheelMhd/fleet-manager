import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabaseClient";
import { z } from "zod";

const assignSeatSchema = z.object({
  studentId: z.string().min(1),
  routeId: z.string().min(1),
  seatNumber: z.number().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = assignSeatSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten() },
        { status: 400 }
      );
    }

    const { studentId, routeId, seatNumber } = result.data;

    // 1. Get Route and Bus info to check capacity
    const { data: route, error: routeError } = await supabase
      .from("routes")
      .select("*, bus:buses(*)")
      .eq("id", routeId)
      .single();

    if (routeError || !route) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 });
    }

    if (!route.bus) {
      return NextResponse.json(
        { error: "No bus assigned to this route" },
        { status: 400 }
      );
    }

    if (seatNumber > route.bus.capacity) {
      return NextResponse.json(
        { error: `Seat number exceeds bus capacity of ${route.bus.capacity}` },
        { status: 400 }
      );
    }

    // 2. Check if seat is already occupied
    const { data: existingStudent, error: existingError } = await supabase
      .from("students")
      .select("id")
      .eq("route_id", routeId)
      .eq("seat_number", seatNumber)
      .neq("id", studentId) // Ignore self if just updating
      .single();

    if (existingStudent) {
      return NextResponse.json(
        { error: `Seat ${seatNumber} is already occupied` },
        { status: 409 }
      );
    }

    // 3. Update Student
    const { data, error: updateError } = await supabase
      .from("students")
      .update({ route_id: routeId, seat_number: seatNumber })
      .eq("id", studentId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
