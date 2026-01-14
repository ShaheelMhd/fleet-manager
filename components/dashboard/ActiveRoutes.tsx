"use client";

import { useEffect, useState } from "react";
import { ShinyCard } from "@/components/ui/ShinyCard";
import { Route } from "@/types";
import { Navigation, Bus } from "lucide-react";

export function ActiveRoutes() {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Optimized: only fetch minimal data if possible, or just standard fetch
        // To reduce requests? The user said "constant requests". 
        // We'll just fetch once on mount.
        const fetchRoutes = async () => {
            try {
                const res = await fetch("/api/routes");
                const data = await res.json();
                setRoutes(data);
            } catch (error) {
                console.error("Failed to fetch routes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoutes();
    }, []);

    // Filter to show only a few active routes? Or all?
    // Let's show top 4 for the widget.
    const displayRoutes = routes.slice(0, 4);

    return (
        <ShinyCard className="h-full flex flex-col p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold tracking-wide">ACTIVE ROUTES</h3>
                <span className="bg-secondary px-3 py-1 rounded-full text-xs font-medium text-muted-foreground">
                    {routes.length} Total
                </span>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">Loading...</div>
            ) : (
                <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                    {displayRoutes.map(route => (
                        <div key={route.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary">
                                    <Navigation className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-foreground">{route.name}</span>
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 flex-wrap">
                                        {(() => {
                                            const busesList = Array.isArray(route.buses) ? route.buses : (route.buses ? [route.buses] as any[] : []);
                                            return busesList.length > 0 ? (
                                                busesList.map(bus => (
                                                    <span key={bus.id} className="flex items-center gap-1 bg-secondary/80 px-1.5 py-0.5 rounded-md">
                                                        <Bus className="w-3 h-3" /> {bus.number}
                                                    </span>
                                                ))
                                            ) : "No bus assigned";
                                        })()}
                                    </span>
                                </div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-sidebar-primary shadow-[0_0_5px_var(--sidebar-primary)]" />
                        </div>
                    ))}
                    {routes.length === 0 && (
                        <div className="text-center text-muted-foreground text-xs py-4">No active routes found.</div>
                    )}
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
                <span>System Status</span>
                <span className="text-sidebar-primary font-bold">Operational</span>
            </div>
        </ShinyCard>
    );
}
