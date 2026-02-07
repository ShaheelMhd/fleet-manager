"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import ForgotPasswordForm from "./ForgotPasswordForm";

const ForgotPasswordPage = () => {
  return (
    <Card className="w-full bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl font-light text-white text-center">Reset Password</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-5 w-full">
        <p className="text-sm text-white/60 text-center">
            Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
        <ForgotPasswordForm />
        <p className="text-sm text-white/60 text-center">
          Remember your password?{" "}
          <Link className="text-white hover:underline" href="/signin">
            Sign in here.
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordPage;
