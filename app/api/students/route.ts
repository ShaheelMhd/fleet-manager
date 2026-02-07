import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabaseClient";
import { studentSchema } from "../schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const routeId = searchParams.get("routeId");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  let query = supabase
    .from("students")
    .select("id, name, student_id, route_id, bus_id, seat_number, created_at", { count: "exact" })
    .order("name", { ascending: true })
    .range(offset, offset + limit - 1);

  if (routeId) {
    query = query.eq("route_id", routeId);
  }

  const { data, error, count } = await query;

  if (error) {
    logger.error("Failed to fetch students", error, { routeId, page, limit });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: count ? Math.ceil(count / limit) : 0,
    },
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
    if (result.data.seat_number && result.data.bus_id) {
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
      logger.error("Failed to create student", error, { body });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    logger.info("Student created successfully", { studentId: data.id });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    logger.error("Internal Server Error in POST /api/students", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
