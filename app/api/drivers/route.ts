import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabaseClient";
import { driverSchema } from "@/app/api/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  let query = supabase
    .from("drivers")
    .select("*, buses(id, number)", { count: "exact" })
    .order("name", { ascending: true })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    logger.error("Failed to fetch drivers", error, { search, page, limit });
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
    const result = driverSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten() },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("drivers")
      .insert([result.data])
      .select()
      .single();

    if (error) {
      logger.error("Failed to create driver", error, { body });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    logger.info("Driver created successfully", { driverId: data.id });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    logger.error("Internal Server Error in POST /api/drivers", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
