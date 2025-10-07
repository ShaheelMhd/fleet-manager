import { supabase } from "@/utils/supabaseClient";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { userSchema } from "../../schema";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = userSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  // check if user already exists using the RPC function
  const { data: existingUser, error: existingError } = await supabase.rpc(
    "get_next_auth_user_by_email",
    { email: body.email }
  );

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  if (existingUser && existingUser.length > 0)
    return NextResponse.json(
      { error: "User with this email already exists!" },
      { status: 400 }
    );

  const hashedPassword = await bcrypt.hash(body.password, 10);

  // insert new user using the RPC function
  const { data: newUser, error: insertError } = await supabase.rpc(
    "insert_next_auth_user",
    {
      name: body.name,
      email: body.email,
      password: hashedPassword,
    }
  );

  if (insertError) {
    console.error("Insert error: ", insertError);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // newUser is an array, so return the first user
  const createdUser = Array.isArray(newUser) ? newUser[0] : newUser;

  return NextResponse.json(
    {
      message: "User created successfully",
      user: { id: createdUser.id, email: createdUser.email },
    },
    { status: 200 }
  );
}
