"use client"

import { ReactNode } from "react";
import Link from "next/link";
import ShaderBackground from "@/components/landing/ShaderBackground";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <ShaderBackground>
        <div className="absolute top-6 left-6 z-20">
            <Link href="/" className="flex items-center">
                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-black font-bold text-lg hover:scale-105 transition-transform">
                    TKI
                </div>
            </Link>
        </div>
        <div className="fixed inset-0 z-10 w-full h-full flex items-center justify-center p-6 pointer-events-none">
            <div className="w-full max-w-md pointer-events-auto">
                {children}
            </div>
        </div>
    </ShaderBackground>
  );
}
