"use client";

import { AlertTriangle, ArrowUpRight, Bus, MapPin, Users, Armchair } from "lucide-react";
import { ShinyCard } from "@/components/ui/ShinyCard";

export function AlertCard({ maintenanceCount }: { maintenanceCount: number }) {
    return (
        <ShinyCard className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sidebar-primary/10 flex items-center justify-center text-sidebar-primary border border-sidebar-primary/20">
                    <AlertTriangle className="fill-current w-6 h-6" />
                </div>
                <div>
                    <h4 className="font-bold text-sm text-foreground uppercase tracking-wide mb-1">Fleet Maintenance</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
                        There are <span className="text-sidebar-primary font-bold">{maintenanceCount}</span> buses currently in maintenance. Please review the schedule.
                    </p>
                </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity">
                <ArrowUpRight className="w-5 h-5" />
            </button>
        </ShinyCard>
    )
}

export function RouteInsightsCard({ insights = [] }: { insights: any[] }) {
    return (
        <ShinyCard className="p-6 h-full">
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold leading-tight text-foreground uppercase">ROUTE <br /> UTILIZATION</h3>
                    <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 space-y-4 my-2">
                    {insights.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">No route data available</p>
                    ) : (
                        insights.map((route) => (
                            <div key={route.id} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="font-bold text-foreground truncate max-w-[120px]">{route.name}</span>
                                    <span className="text-muted-foreground">{route.assigned}/{route.capacity}</span>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                                    <div 
                                        className="bg-sidebar-primary h-full rounded-full transition-all duration-500" 
                                        style={{ width: `${Math.min(100, (route.assigned / (route.capacity || 1)) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between text-[10px] font-mono text-muted-foreground/60 uppercase">
                    <span>Live occupancy data</span>
                    <span className="text-foreground">Refreshed</span>
                </div>
            </div>
        </ShinyCard>
    )
}

export function FleetCapacityCard({ occupancyRate, totalOccupied, totalCapacity }: { occupancyRate: number, totalOccupied: number, totalCapacity: number }) {
    return (
        <ShinyCard className="p-6 h-full group">
            <div className="flex flex-col h-full relative z-10">
                <div className="relative z-10 flex justify-between w-full mb-6">
                    <h3 className="text-2xl font-bold tracking-tight uppercase">CAPACITY</h3>
                    <div className="flex flex-col gap-2 items-end">
                        <div className="bg-sidebar-primary/10 text-sidebar-primary px-3 py-1 rounded-full text-xs font-bold border border-sidebar-primary/20">
                            {occupancyRate}% Full
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center py-4">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                         <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-secondary"
                            />
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={251.2}
                                strokeDashoffset={251.2 - (251.2 * occupancyRate) / 100}
                                className="text-sidebar-primary transition-all duration-1000"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <Armchair className="w-6 h-6 text-foreground mb-1" />
                        </div>
                    </div>
                </div>

                <div className="mt-auto relative z-10">
                    <div className="bg-popover text-popover-foreground border border-border p-3 rounded-xl flex items-center gap-3 shadow-lg">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                            <Users className="w-4 h-4 text-foreground" />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-sidebar-primary flex items-center gap-1">
                                {totalOccupied} / {totalCapacity} SEATS
                            </div>
                            <div className="font-bold text-xs leading-tight">Overall Fleet Occupancy</div>
                        </div>
                    </div>
                </div>
            </div>
        </ShinyCard>
    );
}

export function FleetSummaryCard({ stats }: { stats: any }) {
    return (
        <ShinyCard className="p-6 h-full">
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-lg font-bold text-foreground uppercase tracking-wide">Operations Summary</h3>
                    <div className="w-8 h-8 rounded-full bg-sidebar-primary/10 text-sidebar-primary flex items-center justify-center border border-sidebar-primary/20">
                        <Bus className="w-4 h-4" />
                    </div>
                </div>

                <div className="space-y-4 flex-1">
                    <div className="bg-secondary/50 rounded-2xl p-4 border border-border/50">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Currently, <span className="text-foreground font-bold">{stats?.fleetStatus?.active}</span> buses are on the road serving <span className="text-sidebar-primary font-bold">{stats?.activeRoutes}</span> active routes.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-secondary/30 p-3 rounded-xl border border-border/30">
                            <span className="text-[10px] text-muted-foreground uppercase block mb-1">Students</span>
                            <span className="text-lg font-bold">{stats?.totalStudents}</span>
                        </div>
                        <div className="bg-secondary/30 p-3 rounded-xl border border-border/30">
                            <span className="text-[10px] text-muted-foreground uppercase block mb-1">Capacity</span>
                            <span className="text-lg font-bold">{stats?.totalCapacity}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex gap-2 flex-wrap">
                    <div className="px-3 py-1.5 rounded-full bg-sidebar-primary/10 text-sidebar-primary border border-sidebar-primary/20 text-[10px] font-bold uppercase">
                        System Online
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-secondary text-muted-foreground border border-border text-[10px] font-bold uppercase">
                        Kollam, Kerala
                    </div>
                </div>
            </div>
        </ShinyCard>
    )
}
