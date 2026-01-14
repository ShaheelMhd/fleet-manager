"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import SignOutButton from "@/app/(auth)/signout/SignOutButton";

export function Navbar() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      active: pathname === "/",
    },
    {
      href: "/routes",
      label: "Routes",
      active: pathname === "/routes",
    },
    {
      href: "/students",
      label: "Students",
      active: pathname === "/students",
    },
    {
        href: "/buses",
        label: "Buses",
        active: pathname === "/buses"
    }
  ];

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 border-b px-6 py-4 bg-background">
        <div className="mr-4 font-bold text-xl">
            Fleet Manager
        </div>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
      <div className="ml-auto flex items-center space-x-4">
        <SignOutButton />
      </div>
    </nav>
  );
}
