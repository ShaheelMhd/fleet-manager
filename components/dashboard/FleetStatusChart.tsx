"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, Cell, XAxis, YAxis } from "recharts";
import { Bus } from "lucide-react";
import { ShinyCard } from "@/components/ui/ShinyCard";
import { useEffect, useState } from "react";

export function FleetStatusChart() {
    const [data, setData] = useState([
        { name: "Active", value: 0, color: "#9d4edd" },
        { name: "Maintenance", value: 0, color: "#27272a" },
        { name: "Idle", value: 0, color: "#52525b" },
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/buses")
            .then(res => res.json())
            .then((buses: any[]) => {
                const active = buses.filter(b => b.status === "active").length;
                const maintenance = buses.filter(b => b.status === "maintenance").length;
                const idle = buses.filter(b => b.status === "idle").length;

                setData([
                    { name: "Active", value: active, color: "#9d4edd" },
                    { name: "Maintenance", value: maintenance, color: "#27272a" },
                    { name: "Idle", value: idle, color: "#52525b" },
                ]);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch fleet status", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <ShinyCard className="p-6 h-full flex items-center justify-center">
                <p className="text-muted-foreground text-xs animate-pulse">Loading fleet data...</p>
            </ShinyCard>
        );
    }

    return (
        <ShinyCard className="p-6 h-full">
            <div className="flex flex-col h-full justify-between">
                <div className="flex justify-between items-start relative z-10 w-full mb-4">
                    <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-border/50">
                        <div className="w-5 h-5 bg-primary/10 rounded-md flex items-center justify-center">
                            <Bus className="w-3 h-3 text-primary" />
                        </div>
                        <span className="font-semibold tracking-wide text-sm">FLEET STATUS</span>
                    </div>
                </div>

                <div className="flex-1 w-full min-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} barSize={48}>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                                dy={10}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{
                                    backgroundColor: '#09090b',
                                    borderRadius: '12px',
                                    border: '1px solid #27272a',
                                    color: '#fff'
                                }}
                            />
                            <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex gap-6 mt-4 justify-center text-xs font-medium text-muted-foreground border-t border-border/50 pt-4">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="uppercase tracking-wider font-bold">{item.name}</span>
                            <span className="text-foreground font-bold bg-secondary px-2 py-0.5 rounded-full">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </ShinyCard>
    );
}
