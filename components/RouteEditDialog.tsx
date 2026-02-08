"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { routeSchema } from "@/app/api/schema";
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
import { Route } from "@/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Pencil } from "lucide-react";

interface RouteEditFormProps {
    route: Route;
    onSuccess?: () => void;
}

type RouteFormValues = z.infer<typeof routeSchema>;

export function RouteEditDialog({ route, onSuccess }: RouteEditFormProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const form = useForm<RouteFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(routeSchema) as any,
        defaultValues: {
            name: route.name,
            stops: route.stops || [],
        },
    });

    async function onSubmit(values: RouteFormValues) {
        try {
            const response = await fetch(`/api/routes/${route.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error("Failed to update route");
            }

            toast.success("Route updated successfully");
            router.refresh();
            onSuccess?.();
            setOpen(false);
        } catch (error) {
            toast.error("Error updating route");
            console.error(error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-sidebar-primary absolute top-4 right-4 z-10">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-card text-card-foreground border-border">
                <DialogHeader>
                    <DialogTitle>Edit Route {route.name}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Route Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Route A" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1 bg-sidebar-primary hover:bg-sidebar-primary/90">Update Route</Button>
                            <Button type="button" variant="destructive" size="icon" onClick={async () => {
                                if (!confirm("Are you sure you want to delete this route?")) return;
                                try {
                                    const res = await fetch(`/api/routes/${route.id}`, { method: 'DELETE' });
                                    if (!res.ok) throw new Error("Failed to delete");
                                    toast.success("Route deleted");
                                    router.refresh();
                                    onSuccess?.();
                                    setOpen(false);
                                } catch (err) {
                                    toast.error("Failed to delete route");
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
