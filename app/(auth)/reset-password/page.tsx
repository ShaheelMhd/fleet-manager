"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ResetPasswordForm from "./ResetPasswordForm";

const ResetPasswordPage = () => {
  return (
    <Card className="w-full bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl font-light text-white text-center">Update Password</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-5 w-full">
        <p className="text-sm text-white/60 text-center">
            Please enter your new password below.
        </p>
        <ResetPasswordForm />
      </CardContent>
    </Card>
  );
};

export default ResetPasswordPage;
