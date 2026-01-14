import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "./api/auth/AuthProvider";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fleet Manager",
  description: "Fleet manager for TKM Institute of Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground overflow-hidden`}
      >
        <AuthProvider>
          <div className="flex h-screen w-full overflow-hidden bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
              <Header />
              <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 pt-2">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
        <Toaster className="mr-2" duration={2000} />
      </body>
    </html>
  );
}
