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
import { useEffect, useState } from "react";
import { Route } from "@/types";

interface StudentFormProps {
  onSuccess?: () => void;
}

type StudentFormValues = z.infer<typeof studentSchema>;

export function StudentForm({ onSuccess }: StudentFormProps) {
  const router = useRouter();
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    fetch("/api/routes")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRoutes(data);
        else setRoutes([]);
      })
      .catch((err) => console.error(err));
  }, []);

  const form = useForm<StudentFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(studentSchema) as any,
    defaultValues: {
      name: "",
      student_id: "",
      route_id: "",
    },
  });

  async function onSubmit(values: StudentFormValues) {
    try {
      const payload = {
        ...values,
        route_id: values.route_id === "" ? null : values.route_id
      };

      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create student");
      }

      toast.success("Student created successfully");
      form.reset();
      router.refresh();
      onSuccess?.();
    } catch (error) {
      toast.error("Error creating student");
      console.error(error);
    }
  }

  return (
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
              <FormLabel>Assigned Route (Optional)</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                  value={field.value || ""}
                >
                  <option value="">Select a route</option>
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
        <Button type="submit">Create Student</Button>
      </form>
    </Form>
  );
}
