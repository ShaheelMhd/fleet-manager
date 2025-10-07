import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next/types";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Sign Up - Bus Portal",
  description: "Create an account on the bus portal",
};

const RegisterPage = () => {
  return (
    <div
      className="flex flex-col items-center justify-center
    sm:w-[85%] md:w-[65%] lg:w-[55%] xl:w-[40%]"
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
