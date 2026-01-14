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

import { useEffect, useState } from "react";
import { Route } from "@/types";

interface BusFormProps {
  onSuccess?: () => void;
}

type BusFormValues = z.infer<typeof busSchema>;

export function BusForm({ onSuccess }: BusFormProps) {
  const router = useRouter();
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    fetch("/api/routes")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRoutes(data);
        else setRoutes([]);
      })
      .catch(err => console.error(err));
  }, []);

  const form = useForm<BusFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(busSchema) as any,
    defaultValues: {
      number: "",
      capacity: 40,
      status: "active",
      route_id: null,
    },
  });

  async function onSubmit(values: BusFormValues) {
    try {
      const payload = {
        ...values,
        route_id: values.route_id === "unassigned" || values.route_id === "" ? null : values.route_id
      };

      const response = await fetch("/api/buses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create bus");
      }

      toast.success("Bus created successfully");
      form.reset();
      router.refresh();
      onSuccess?.();
    } catch (error) {
      toast.error("Error creating bus");
      console.error(error);
    }
  }

  return (
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
        <Button type="submit">Create Bus</Button>
      </form>
    </Form>
  );
}
