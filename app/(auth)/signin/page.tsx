"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import SignInForm from "./SignInForm";

const SignInPage = () => {
  return (
    <Card className="w-full bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl font-light text-white text-center">Login</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-5 w-full">
        <SignInForm />
        <p className="text-sm text-white/60">
          Don&apos;t have an account?{" "}
          <Link className="text-white hover:underline" href="/register">
            Register now.
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignInPage;
