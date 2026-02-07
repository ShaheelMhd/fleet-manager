import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabaseClient";
import { busSchema } from "../schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from("buses")
    .select("id, number, capacity, status, maintenance_notes, route_id, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    logger.error("Failed to fetch buses", error, { page, limit });
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
    const result = busSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten() },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("buses")
      .insert([result.data])
      .select()
      .single();

    if (error) {
      logger.error("Failed to create bus", error, { body });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    logger.info("Bus created successfully", { busId: data.id });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    logger.error("Internal Server Error in POST /api/buses", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
