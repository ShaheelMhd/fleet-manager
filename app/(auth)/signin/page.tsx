import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import SignInForm from "./SignInForm";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Sign In - Bus Portal",
    description: "Login to the bus portal",
  };
}

const SignInPage = () => {
  return (
    <div
      className="w-full sm:w-[85%] md:w-[65%] lg:w-[55%] xl:w-[40%]
    flex flex-col items-center justify-center -mx-5"
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="h2">Login</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-5 w-full">
          <SignInForm />
          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <Link className=" text-blue-400" href="/register">
              Register now.
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
