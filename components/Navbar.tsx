"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import SignOutButton from "@/app/(auth)/signout/SignOutButton";

export function Navbar() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/routes",
      label: "Routes",
      active: pathname === "/dashboard/routes",
    },
    {
      href: "/dashboard/students",
      label: "Students",
      active: pathname === "/dashboard/students",
    },
    {
        href: "/dashboard/buses",
        label: "Buses",
        active: pathname === "/dashboard/buses"
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
