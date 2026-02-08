import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabaseClient";
import { routeSchema } from "../schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import { logger } from "@/lib/logger";

export async function GET() {
  const { data, error } = await supabase
    .from("routes")
    .select("id, name, stops, created_at, buses(id, number, capacity)")
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("Failed to fetch routes", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = routeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten() },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("routes")
      .insert([result.data])
      .select()
      .single();

    if (error) {
      logger.error("Failed to create route", error, { body });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    logger.info("Route created successfully", { routeId: data.id });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    logger.error("Internal Server Error in POST /api/routes", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
