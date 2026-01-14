"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface ShinyCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function ShinyCard({ children, className, ...props }: ShinyCardProps) {
    return (
        <div
            className={cn(
                "group relative rounded-3xl bg-card border border-border overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_-10px_var(--sidebar-primary)]",
                className
            )}
            {...props}
        >
            {/* Shine Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sidebar-primary/10 to-transparent -translate-x-[100%] group-hover:animate-shine" />
            </div>

            {/* Border Glow */}
            <div className="absolute inset-0 rounded-3xl border border-sidebar-primary/0 group-hover:border-sidebar-primary/20 transition-colors duration-300 pointer-events-none" />

            <div className="relative z-10 h-full">
                {children}
            </div>
        </div>
    );
}
