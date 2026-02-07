"use client";

import { AlertTriangle, Wrench, Clock } from "lucide-react";
import { ShinyCard } from "@/components/ui/ShinyCard";
import { Button } from "../ui/button";

export function MaintenanceAlerts({ alerts }: { alerts: any[] }) {

    return (
        <ShinyCard className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-bold text-foreground red tracking-wide uppercase">
                    Maintenance & Idle
                </h3>
                <button className="w-8 h-8 rounded-full bg-secondary text-foreground flex items-center justify-center hover:bg-secondary/80 transition-colors">
                    <Wrench className="w-4 h-4" />
                </button>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto max-h-[300px] pr-2 scrollbar-thin scrollbar-thumb-sidebar-primary/20 hover:scrollbar-thumb-sidebar-primary/40">
                {alerts.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm py-4">
                        No buses in maintenance or idle.
                    </div>
                ) : (
                    alerts.map((bus) => (
                        <div
                            key={bus.id}
                            className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors"
                        >
                            <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bus.status === "maintenance"
                                    ? "bg-red-500/20 text-red-500"
                                    : "bg-yellow-500/20 text-yellow-500"
                                    }`}
                            >
                                {bus.status === "maintenance" ? (
                                    <AlertTriangle className="w-5 h-5" />
                                ) : (
                                    <Clock className="w-5 h-5" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h4 className="font-bold text-sm text-foreground truncate">
                                        Bus #{bus.number}
                                    </h4>
                                    <span className="text-[10px] text-muted-foreground font-medium bg-background px-1.5 py-0.5 rounded-full capitalize">
                                        {bus.status}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">
                                    Check required
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-auto pt-4">
                <Button className="w-full py-2.5 rounded-xl bg-sidebar-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity">
                    Schedule Service
                </Button>
            </div>
        </ShinyCard>
    );
}
