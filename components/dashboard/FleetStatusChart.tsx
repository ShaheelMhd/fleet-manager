"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, Cell, XAxis, YAxis } from "recharts";
import { Bus } from "lucide-react";
import { ShinyCard } from "@/components/ui/ShinyCard";

const data = [
    { name: "Active", value: 24, color: "#9d4edd" }, // Amethyst (Sidebar Primary)
    { name: "Maintenance", value: 4, color: "#27272a" }, // Dark Gray (Border/Accent)
    { name: "Idle", value: 2, color: "#52525b" }, // Gray (Zinc-600)
];

export function FleetStatusChart() {
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
