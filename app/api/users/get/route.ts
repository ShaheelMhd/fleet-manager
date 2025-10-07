// usable in client components

import { getUser } from "@/utils/getUser";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUser();
  return NextResponse.json({ user });
}
