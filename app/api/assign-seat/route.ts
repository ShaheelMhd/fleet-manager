import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabaseClient";
import { z } from "zod";

const assignSeatSchema = z.object({
  studentId: z.string().min(1),
  routeId: z.string().min(1),
  busId: z.string().min(1),
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

    const { studentId, routeId, busId, seatNumber } = result.data;

    // 1. Get Route and Buses info
    // Note: Since we changed relation to One-Route-Many-Buses, we fetch buses
    const { data: route, error: routeError } = await supabase
      .from("routes")
      .select("*, buses(*)")
      .eq("id", routeId)
      .single();

    if (routeError || !route) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 });
    }

    // Find the specific bus
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const targetBus = (route as any).buses?.find((b: any) => b.id === busId);

    if (!targetBus) {
      return NextResponse.json(
        { error: "Selected bus not found on this route" },
        { status: 400 }
      );
    }

    if (seatNumber > targetBus.capacity) {
      return NextResponse.json(
        { error: `Seat number exceeds bus capacity of ${targetBus.capacity}` },
        { status: 400 }
      );
    }

    // 2. Check if seat is already occupied ON THIS BUS
    const { data: existingStudent } = await supabase
      .from("students")
      .select("id")
      .eq("bus_id", busId)
      .eq("seat_number", seatNumber)
      .neq("id", studentId) // Ignore self if just updating
      .single();

    if (existingStudent) {
      return NextResponse.json(
        { error: `Seat ${seatNumber} is already occupied on this bus` },
        { status: 409 }
      );
    }

    // 3. Update Student with route AND bus
    const { data, error: updateError } = await supabase
      .from("students")
      .update({ route_id: routeId, bus_id: busId, seat_number: seatNumber })
      .eq("id", studentId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error assigning seat:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
