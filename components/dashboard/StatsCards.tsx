"use client";

import { AlertTriangle, ArrowUpRight, Clock, MapPin, Mic, Plus } from "lucide-react";
import { ShinyCard } from "@/components/ui/ShinyCard";

export function AlertCard() {
    return (
        <ShinyCard className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sidebar-primary/10 flex items-center justify-center text-sidebar-primary border border-sidebar-primary/20">
                    <AlertTriangle className="fill-current w-6 h-6" />
                </div>
                <div>
                    <h4 className="font-bold text-sm text-foreground uppercase tracking-wide mb-1">Stabilizing Labor Cost</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
                        Approve critical alerts and check Inventory Risk. Shift ends in <span className="text-sidebar-primary font-medium">2:59:12</span> hours.
                    </p>
                </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity">
                <ArrowUpRight className="w-5 h-5" />
            </button>
        </ShinyCard>
    )
}

export function OperationsCard() {
    return (
        <ShinyCard className="p-6 h-full">
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold leading-tight text-foreground">OPERATIONAL <br /> TIMING</h3>
                    <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 flex items-center justify-center my-4 relative">
                    {/* Simulated Radial Clock */}
                    <div className="w-32 h-32 rounded-full border-4 border-dashed border-border flex items-center justify-center relative">
                        <Clock className="w-12 h-12 text-sidebar-primary" />
                        <div className="absolute inset-0 border-t-4 border-sidebar-primary rounded-full rotate-45" />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-sidebar-primary" />
                        <span className="text-xs text-muted-foreground">Peak</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-muted" />
                        <span className="text-xs text-muted-foreground">Completion</span>
                    </div>
                </div>
                <div className="absolute bottom-4 right-4 text-xs font-mono text-muted-foreground/40 text-right">
                    UTC-5
                    <br />
                    <span className="text-foreground">12:47:33</span>
                </div>
            </div>
        </ShinyCard>
    )
}

export function MapCard() {
    return (
        <ShinyCard className="p-6 h-full group">
            <div className="flex flex-col h-full relative z-10">
                {/* Abstract Map Background Simulation - Darkened */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png')] bg-cover bg-center grayscale invert pointer-events-none -m-6" />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent pointer-events-none -m-6" />

                <div className="relative z-10 flex justify-between w-full">
                    <h3 className="text-2xl font-bold tracking-tight">POINTS</h3>
                    <div className="flex flex-col gap-2 items-end">
                        <button className="bg-background/80 hover:bg-background px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xl transition-colors flex items-center gap-1 border border-border">
                            all points <ArrowUpRight className="w-3 h-3" />
                        </button>
                        <button className="bg-background/60 hover:bg-background/80 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xl transition-colors border border-border/50">
                            profitability rate
                        </button>
                    </div>
                </div>

                <div className="mt-auto relative z-10">
                    <div className="bg-popover text-popover-foreground border border-border p-3 rounded-xl inline-flex items-center gap-3 shadow-lg">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-foreground" />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-sidebar-primary flex items-center gap-1">
                                +1.1%
                            </div>
                            <div className="font-bold text-xs leading-tight">TKM Institute Of Technology<br /> Kollam, Kerala</div>
                        </div>
                    </div>
                </div>
            </div>
        </ShinyCard>
    );
}

export function AILeadCard() {
    return (
        <ShinyCard className="p-6 h-full">
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-lg font-bold text-foreground uppercase tracking-wide">AI Operations Lead</h3>
                    <button className="w-8 h-8 rounded-full bg-secondary text-foreground flex items-center justify-center hover:bg-secondary/80 transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sidebar-primary to-purple-900 flex-shrink-0" />
                    <div className="bg-secondary rounded-r-2xl rounded-bl-2xl p-4 text-sm text-muted-foreground leading-relaxed relative border border-border/50">
                        <span className="text-muted-foreground/60 text-xs block mb-1">Hi, Hanna,</span>
                        The Daily Grind shows strong revenue, but two flags need attention: <span className="text-foreground font-medium">AOV is dipping</span> and Labor Cost is <span className="text-sidebar-primary font-bold">28%</span>. Let&apos;s initiate the optimization strategy.
                    </div>
                </div>

                <div className="flex gap-2 mb-6 pl-14 flex-wrap">
                    <button className="px-3 py-1.5 rounded-full bg-sidebar-primary/10 text-sidebar-primary border border-sidebar-primary/20 text-xs font-bold flex items-center gap-1 hover:bg-sidebar-primary/20 transition-colors">
                        Hi! 🔍 Show labor cost
                    </button>
                    <button className="px-3 py-1.5 rounded-full bg-secondary text-muted-foreground border border-border text-xs font-bold hover:bg-secondary/80 transition-colors">
                        🗓️ Initiate strategy planning
                    </button>
                </div>

                <div className="mt-auto bg-secondary rounded-full p-1.5 flex items-center pl-4 gap-2 border border-border">
                    <button className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity">
                        <Plus className="w-5 h-5" />
                    </button>
                    <input type="text" placeholder="Ask something or choose to start" className="bg-transparent border-none outline-none text-sm text-foreground flex-1 placeholder:text-muted-foreground/50" />
                    <div className="px-3 opacity-40">
                        <Mic className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </ShinyCard>
    )
}
