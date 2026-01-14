import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabaseClient";
import { studentSchema } from "../schema";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const routeId = searchParams.get("routeId");

  let query = supabase
    .from("students")
    .select("*, route:routes(*)")
    .order("name", { ascending: true });

  if (routeId) {
    query = query.eq("route_id", routeId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = studentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten() },
        { status: 400 }
      );
    }

    // Check for seat assignment if seat_number is provided
    if (result.data.seat_number && result.data.route_id) {
      // We'll handle seat assignment logic in the specialized endpoint mostly,
      // but for direct creation, we must ensure it's not taken.
      const { data: existing } = await supabase
        .from("students")
        .select("id")
        .eq("bus_id", result.data.bus_id)
        .eq("seat_number", result.data.seat_number)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: "Seat is already occupied." },
          { status: 409 }
        );
      }
    }

    const { data, error } = await supabase
      .from("students")
      .insert([result.data])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
