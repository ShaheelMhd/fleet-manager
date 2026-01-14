"use client";

import { AlertTriangle, Wrench } from "lucide-react";
import { ShinyCard } from "@/components/ui/ShinyCard";

const alerts = [
    { id: 1, type: "urgent", bus: "Bus #104", issue: "Brake check required", time: "Today" },
    { id: 2, type: "warning", bus: "Bus #108", issue: "Oil change due", time: "Tomorrow" },
    { id: 3, type: "info", bus: "Bus #102", issue: "Scheduled cleaning", time: "Fri, 12th" },
];

export function MaintenanceAlerts() {
    return (
        <ShinyCard className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-bold text-foreground red tracking-wide uppercase">Maintenance</h3>
                <button className="w-8 h-8 rounded-full bg-secondary text-foreground flex items-center justify-center hover:bg-secondary/80 transition-colors">
                    <Wrench className="w-4 h-4" />
                </button>
            </div>

            <div className="flex flex-col gap-3">
                {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${alert.type === 'urgent' ? 'bg-sidebar-primary/20 text-sidebar-primary' :
                                alert.type === 'warning' ? 'bg-sidebar-primary/10 text-sidebar-primary/80' :
                                    'bg-muted text-muted-foreground'
                            }`}>
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h4 className="font-bold text-sm text-foreground truncate">{alert.bus}</h4>
                                <span className="text-[10px] text-muted-foreground font-medium bg-background px-1.5 py-0.5 rounded-full">{alert.time}</span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{alert.issue}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-auto pt-4">
                <button className="w-full py-2.5 rounded-xl bg-sidebar-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity">
                    Schedule Service
                </button>
            </div>
        </ShinyCard>
    )
}
