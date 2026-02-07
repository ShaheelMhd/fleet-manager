import { supabase } from "@/utils/supabaseClient";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { userSchema } from "../../schema";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = userSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.flatten().fieldErrors, {
      status: 400,
    });
  }

  // check if user already exists using the RPC function
  const { data: existingUser, error: existingError } = await supabase.rpc(
    "get_next_auth_user_by_email",
    { email: body.email }
  );

  if (existingError) {
    return NextResponse.json(
      { error: "An unexpected error occurred while checking for existing users." },
      { status: 500 }
    );
  }

  if (existingUser && existingUser.length > 0) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  // Sign up using Supabase Auth
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: body.email,
    password: body.password,
    options: {
      data: {
        name: body.name,
      },
    },
  });

  if (signUpError) {
    let errorMessage = "Failed to create account. Please try again.";
    if (signUpError.status === 429) {
      errorMessage = "Too many requests. Please try again later.";
    } else if (signUpError.message.includes("already registered")) {
      errorMessage = "This email is already registered.";
    }
    return NextResponse.json({ error: errorMessage }, { status: signUpError.status || 500 });
  }

  // Insert into our custom users table for NextAuth/SupabaseAdapter compatibility if needed
  // or handle metadata. Here we use the existing insert_next_auth_user RPC
  const { error: insertError } = await supabase.rpc(
    "insert_next_auth_user",
    {
      name: body.name,
      email: body.email,
      password: hashedPassword,
    }
  );

  if (insertError) {
    console.error("Insert error: ", insertError);
    // Even if this fails, the user is created in auth.users
  }

  return NextResponse.json(
    {
      message: "A confirmation email has been sent. Please check your inbox and confirm your email to log in.",
      user: { id: signUpData.user?.id, email: signUpData.user?.email },
    },
    { status: 200 }
  );
}
