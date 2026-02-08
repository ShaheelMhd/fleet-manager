"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema } from "@/app/api/schema";
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
import { Student, Route } from "@/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";

interface StudentEditDialogProps {
    student: Student;
    onSuccess?: () => void;
}

type StudentFormValues = z.infer<typeof studentSchema>;

export function StudentEditDialog({ student, onSuccess }: StudentEditDialogProps) {
    const [open, setOpen] = useState(false);
    const [routes, setRoutes] = useState<Route[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (open) {
            fetch("/api/routes")
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setRoutes(data);
                    else setRoutes([]);
                })
                .catch(err => console.error(err));
        }
    }, [open]);

    const form = useForm<StudentFormValues>({
        resolver: zodResolver(studentSchema) as any,
        defaultValues: {
            name: student.name,
            student_id: student.student_id,
            route_id: student.route_id,
            // Keep existing seat/bus assignments unless changed implies reset?
            // For simplicity, we just allow editing name/ID/Route here.
            // If route changes, seat/bus should probably handle that logic, but let's stick to basics.
            // The schema includes bus_id/seat_number.
            bus_id: student.bus_id,
            seat_number: student.seat_number,
        },
    });

    async function onSubmit(values: StudentFormValues) {
        try {
            // If route changes, we might want to clear bus/seat?
            // For now, let the backend or user manage that.
            // But we should probably send null for bus/seat if route is cleared?
            // The schema allows optional.

            const payload = {
                ...values,
                route_id: values.route_id === "unassigned" || values.route_id === "" ? null : values.route_id
            };

            const response = await fetch(`/api/students/${student.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update student");
            }

            toast.success("Student updated successfully");
            router.refresh();
            onSuccess?.();
            setOpen(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error updating student");
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
                    <DialogTitle>Edit Student</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Student Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="student_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Student ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="S12345" {...field} />
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
                                            value={field.value || "unassigned"}
                                            onChange={(e) => field.onChange(e.target.value)}
                                        >
                                            <option value="unassigned">Unassigned</option>
                                            {routes.map((route) => (
                                                <option key={route.id} value={route.id}>
                                                    {route.name}
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-2 pt-2">
                            <Button type="submit" className="flex-1 bg-sidebar-primary hover:bg-sidebar-primary/90">Update Student</Button>
                            <Button type="button" variant="destructive" size="icon" onClick={async () => {
                                if (!confirm(`Are you sure you want to delete ${student.name}?`)) return;
                                try {
                                    const res = await fetch(`/api/students/${student.id}`, { method: 'DELETE' });
                                    if (!res.ok) throw new Error("Failed to delete");
                                    toast.success("Student deleted");
                                    router.refresh();
                                    onSuccess?.();
                                    setOpen(false);
                                } catch (err) {
                                    toast.error("Failed to delete student");
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
