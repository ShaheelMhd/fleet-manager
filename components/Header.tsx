"use client";

import { Search, Bell } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export function Header() {
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        toast.info("Search feature coming soon!");
    };

    const handleNotifications = () => {
        toast.info("You have no new notifications.");
    };

    return (
        <header className="flex items-center justify-between p-6 lg:p-6 pl-16 lg:pl-6 bg-background">
            <div className="flex items-center text-muted-foreground text-sm overflow-hidden whitespace-nowrap">
                <span>Dashboard</span>
                <span className="mx-2">/</span>
                <span className="text-foreground">Overview</span>
            </div>

            <div className="flex items-center gap-4">
                <form onSubmit={handleSearch} className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search..." 
                        className="pl-9 w-64 bg-card border-none focus-visible:ring-1 focus-visible:ring-primary"
                    />
                </form>

                <button 
                    onClick={handleNotifications}
                    className="p-2 rounded-full bg-card hover:bg-accent transition-colors text-foreground relative"
                >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card" />
                </button>
            </div>
        </header>
    );
}
