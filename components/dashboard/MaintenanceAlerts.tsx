"use client";

import { AlertTriangle, Wrench, Clock, Calendar, Pencil } from "lucide-react";
import { ShinyCard } from "@/components/ui/ShinyCard";
import { Button } from "../ui/button";
import { useState } from "react";
import { MaintenanceModal } from "./ScheduleServiceModal";

export function MaintenanceAlerts({ alerts }: { alerts: any[] }) {
    const [selectedBus, setSelectedBus] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleScheduleClick = (bus: any) => {
        setSelectedBus(bus);
        setIsModalOpen(true);
    };

    return (
        <ShinyCard className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-bold text-foreground red tracking-wide uppercase">
                    Maintenance
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
                            className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors group"
                        >
                            <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bus.status === "maintenance"
                                    ? "bg-red-500/20 text-red-500"
                                    : "bg-sidebar-primary/20 text-sidebar-primary"
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
                                </div>
                                {bus.status === "scheduled" ? (
                                    <div className="flex flex-col">
                                        <p className="text-[11px] font-medium text-sidebar-primary">
                                            {new Date(bus.next_maintenance_date).toLocaleDateString('en-GB')}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground italic truncate">
                                            {bus.maintenance_notes || `Odometer: ${bus.last_odometer_reading?.toLocaleString()} km`}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-xs text-muted-foreground italic truncate">
                                        {bus.maintenance_notes || "Check required"}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => handleScheduleClick(bus)}
                                className="w-8 h-8 rounded-full bg-background border border-border/50 text-foreground flex items-center justify-center hover:bg-secondary transition-colors opacity-0 group-hover:opacity-100"
                            >
                                {bus.next_maintenance_date ? (
                                    <Pencil className="w-3.5 h-3.5" />
                                ) : (
                                    <Calendar className="w-3.5 h-3.5" />
                                )}
                            </button>
                        </div>
                    ))
                )}
            </div>


            <MaintenanceModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                bus={selectedBus}
                onSuccess={() => {
                    // In a real app, we'd trigger a re-fetch of dashboard data
                    // For now, we'll rely on the toast and the user potentially refreshing
                    window.location.reload();
                }}
            />
        </ShinyCard>
    );
}
