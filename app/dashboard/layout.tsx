"use client"

import { ReactNode, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "unauthenticated") {
    return null; // Let the client side handle the redirect
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {status === "loading" ? (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <Sidebar />
          <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            <Header />
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 pt-2">
              {children}
            </main>
          </div>
        </>
      )}
    </div>
  );
}
