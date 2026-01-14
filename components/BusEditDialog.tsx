"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { busSchema } from "@/app/api/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Bus, Route } from "@/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";

export interface BusEditFormProps {
    bus: Bus;
    onSuccess?: () => void;
}

type BusFormValues = z.infer<typeof busSchema>;

export function BusEditDialog({ bus, onSuccess }: BusEditFormProps) {
    const [open, setOpen] = useState(false);
    const [routes, setRoutes] = useState<Route[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (open) {
            fetch("/api/routes")
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setRoutes(data);
                    } else {
                        console.error("Failed to load routes:", data);
                        setRoutes([]);
                    }
                })
                .catch(err => {
                    console.error(err);
                    setRoutes([]);
                });
        }
    }, [open]);

    const form = useForm<BusFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(busSchema) as any,
        defaultValues: {
            number: bus.number,
            capacity: bus.capacity,
            status: bus.status as "active" | "maintenance" | "idle",
            route_id: bus.route_id,
            maintenance_notes: bus.maintenance_notes,
        },
    });

    async function onSubmit(values: BusFormValues) {
        try {
            const payload = {
                ...values,
                route_id: values.route_id === "unassigned" || values.route_id === "" ? null : values.route_id
            };

            const response = await fetch(`/api/buses/${bus.id}`, {
                method: "PUT", // Assuming your API supports PUT for updating
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update bus");
            }

            toast.success("Bus updated successfully");
            router.refresh();
            onSuccess?.();
            setOpen(false);
        } catch (error) {
            toast.error("Error updating bus");
            console.error(error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-sidebar-primary">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-card text-card-foreground border-border">
                <DialogHeader>
                    <DialogTitle>Edit Bus {bus.number}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bus Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Bus 101" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="route_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Assigned Route</FormLabel>
                                    <FormControl>
                                        <select
                                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            {...field}
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            value={field.value || "unassigned"}
                                            onChange={(e) => field.onChange(e.target.value)}
                                        >
                                            <option value="unassigned">Unassigned</option>
                                            {routes.map(r => (
                                                <option key={r.id} value={r.id}>{r.name}</option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="capacity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Capacity</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <select
                                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            {...field}
                                        >
                                            <option value="active">Active</option>
                                            <option value="maintenance">Maintenance</option>
                                            <option value="idle">Idle</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {(form.watch("status") === "maintenance" || form.watch("status") === "idle") && (
                            <FormField
                                control={form.control}
                                name="maintenance_notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {form.watch("status") === "maintenance" ? "Maintenance Issue" : "Idle Reason"}
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Description..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1 bg-sidebar-primary hover:bg-sidebar-primary/90">Update Bus</Button>
                            <Button type="button" variant="destructive" size="icon" onClick={async () => {
                                if (!confirm("Are you sure you want to delete this bus?")) return;
                                try {
                                    const res = await fetch(`/api/buses/${bus.id}`, { method: 'DELETE' });
                                    if (!res.ok) throw new Error("Failed to delete");
                                    toast.success("Bus deleted");
                                    router.refresh();
                                    onSuccess?.();
                                    setOpen(false);
                                } catch (err) {
                                    toast.error("Failed to delete bus");
                                }
                            }}>
                                <span className="sr-only">Delete</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2 h-4 w-4"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
