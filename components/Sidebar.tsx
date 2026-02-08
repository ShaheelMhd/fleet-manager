"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Bus,
    MapPin,
    Users,
    UserCircle,
    LogOut,
    Menu,
    X,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Bus, label: "Buses", href: "/dashboard/buses" },
    { icon: UserCircle, label: "Drivers", href: "/dashboard/drivers" },
    { icon: MapPin, label: "Routes", href: "/dashboard/routes" },
    { icon: Users, label: "Students", href: "/dashboard/students" },
];

export function Sidebar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

    return (
        <>
            {/* Mobile Toggle Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button variant="outline" size="icon" onClick={toggleMobile} className="bg-card shadow-md">
                    {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
            </div>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={toggleMobile}
                />
            )}

            {/* Sidebar Container */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar border-r border-sidebar-border py-6 transition-all duration-300 ease-in-out lg:relative lg:translate-x-0",
                isCollapsed ? "w-20" : "w-64",
                isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"
            )}>
                {/* Logo Section */}
                <div className={cn(
                    "flex items-center mb-10 px-4 overflow-hidden whitespace-nowrap",
                    isCollapsed && !isMobileOpen ? "justify-center" : "justify-start"
                )}>
                    <Link href="/" className="flex items-center gap-3 hover:scale-105 transition-transform duration-200">
                        <div className="h-10 w-10 min-w-[40px] rounded-xl bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-lg shadow-lg shadow-sidebar-primary/25">
                            TKI
                        </div>
                        {(!isCollapsed || isMobileOpen) && (
                            <span className="font-bold text-xl tracking-tight text-sidebar-foreground">FleetManager</span>
                        )}
                    </Link>
                </div>

                {/* Collapse Toggle Button (Desktop only) */}
                <button 
                    onClick={toggleSidebar}
                    className="hidden lg:flex absolute -right-3 top-20 h-6 w-6 rounded-full bg-sidebar-primary text-sidebar-primary-foreground items-center justify-center shadow-lg border-2 border-background z-50 hover:scale-110 transition-transform"
                >
                    <ChevronRight className={cn("w-4 h-4 transition-transform duration-300", !isCollapsed && "rotate-180")} />
                </button>

                {/* Navigation Items */}
                <nav className="flex-1 flex flex-col gap-2 w-full px-3">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={isCollapsed && !isMobileOpen ? item.label : ""}
                                className={cn(
                                    "flex items-center h-12 rounded-xl transition-all duration-200 relative group overflow-hidden",
                                    isCollapsed && !isMobileOpen ? "justify-center w-12 mx-auto" : "px-4 gap-4 w-full",
                                    isActive
                                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/20"
                                        : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5 min-w-[20px]", isActive ? "text-sidebar-primary-foreground" : "")} />
                                {(!isCollapsed || isMobileOpen) && (
                                    <span className="font-medium whitespace-nowrap">{item.label}</span>
                                )}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-sidebar-primary-foreground rounded-r-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Section (Logout & Profile) */}
                <div className="mt-auto flex flex-col gap-4 w-full px-3">
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className={cn(
                            "flex items-center h-12 rounded-xl bg-sidebar-accent/50 text-sidebar-foreground transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 group overflow-hidden",
                            isCollapsed && !isMobileOpen ? "justify-center w-12 mx-auto" : "px-4 gap-4 w-full"
                        )}
                        title={isCollapsed && !isMobileOpen ? "Logout" : ""}
                    >
                        <LogOut className="w-5 h-5 min-w-[20px]" />
                        {(!isCollapsed || isMobileOpen) && (
                            <span className="font-medium whitespace-nowrap">Logout</span>
                        )}
                    </button>

                    <div className={cn(
                        "flex items-center p-2 rounded-2xl bg-sidebar-accent/30 border border-sidebar-border/50 transition-all",
                        isCollapsed && !isMobileOpen ? "justify-center" : "gap-3"
                    )}>
                        <div className="h-8 w-8 min-w-[32px] rounded-full border border-sidebar-border flex items-center justify-center bg-sidebar-primary/20 text-sidebar-primary ring-2 ring-sidebar-primary/10">
                            <span className="text-xs font-bold uppercase">
                                {session?.user?.name?.charAt(0) || "A"}
                            </span>
                        </div>
                        {(!isCollapsed || isMobileOpen) && (
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-bold text-sidebar-foreground leading-none truncate">
                                    {session?.user?.name || "Admin User"}
                                </span>
                                <span className="text-[10px] text-muted-foreground truncate">
                                    {session?.user?.email || "admin@tkmit.edu"}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
