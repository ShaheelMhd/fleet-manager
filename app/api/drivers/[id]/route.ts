import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabaseClient";
import { driverSchema } from "@/app/api/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data, error } = await supabase
    .from("drivers")
    .select("*, buses(id, number)")
    .eq("id", id)
    .single();

  if (error) {
    logger.error("Failed to fetch driver", error, { id });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const result = driverSchema.partial().safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten() },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("drivers")
      .update(result.data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      logger.error("Failed to update driver", error, { id, body });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    logger.info("Driver updated successfully", { driverId: id });
    return NextResponse.json(data);
  } catch (error) {
    logger.error("Internal Server Error in PATCH /api/drivers/[id]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { error } = await supabase
    .from("drivers")
    .delete()
    .eq("id", id);

  if (error) {
    logger.error("Failed to delete driver", error, { id });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  logger.info("Driver deleted successfully", { driverId: id });
  return NextResponse.json({ message: "Driver deleted successfully" });
}
