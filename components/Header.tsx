"use client";

import { Search, Bell } from "lucide-react";


export function Header() {
    return (
        <header className="flex items-center justify-between p-6 bg-background">
            <div className="flex items-center text-muted-foreground text-sm">
                <span>Dashboard</span>
                <span className="mx-2">/</span>
                <span className="text-foreground">Overview</span>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 rounded-full bg-card hover:bg-accent transition-colors text-foreground">
                    <Search className="w-5 h-5" />
                </button>



                <button className="p-2 rounded-full bg-card hover:bg-accent transition-colors text-foreground relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card" />
                </button>
            </div>
        </header>
    );
}
