"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Bus,
    MapPin,
    Users,
    Settings,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Bus, label: "Fleet", href: "/dashboard/buses" },
    { icon: MapPin, label: "Routes", href: "/dashboard/routes" },
    { icon: Users, label: "Students", href: "/dashboard/students" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-screen w-20 bg-sidebar border-r border-sidebar-border py-6 items-center flex-shrink-0 sticky top-0">
            <div className="mb-8">
                <div className="h-10 w-10 rounded-xl bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-lg">
                    TKI
                </div>
            </div>

            <nav className="flex-1 flex flex-col gap-4 w-full px-2">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-center h-12 w-12 rounded-2xl transition-all duration-200 mx-auto group relative",
                                isActive
                                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/25"
                                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3 bg-sidebar-primary rounded-r-full -ml-[10px]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto flex flex-col gap-4 items-center w-full px-2">
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center justify-center h-10 w-10 rounded-xl bg-sidebar-accent text-sidebar-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors group relative"
                    title="Logout"
                >
                    <LogOut className="w-5 h-5" />
                </button>

                <div className="h-10 w-10 rounded-full border-2 border-sidebar-border overflow-hidden p-0.5">
                    <Avatar className="h-full w-full">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </div>
    );
}
