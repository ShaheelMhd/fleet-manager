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
import { useEffect, useState } from "react";
import { Bus } from "@/types";

interface RouteFormProps {
  onSuccess?: () => void;
}

type RouteFormValues = z.infer<typeof routeSchema>;

export function RouteForm({ onSuccess }: RouteFormProps) {
  const router = useRouter();
  const [buses, setBuses] = useState<Bus[]>([]);
  
  useEffect(() => {
    fetch("/api/buses")
      .then((res) => res.json())
      .then((data) => setBuses(data))
      .catch((err) => console.error(err));
  }, []);

  const form = useForm<RouteFormValues>({
    resolver: zodResolver(routeSchema) as any,
    defaultValues: {
      name: "",
      stops: [],
      bus_id: "",
    },
  });

  async function onSubmit(values: RouteFormValues) {
    try {
      // If bus_id is empty string, make it null
      const payload = {
          ...values,
          bus_id: values.bus_id === "" ? null : values.bus_id
      };
      
      const response = await fetch("/api/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create route");
      }

      toast.success("Route created successfully");
      form.reset();
      router.refresh();
      onSuccess?.();
    } catch (error) {
      toast.error("Error creating route");
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
              <FormLabel>Route Name</FormLabel>
              <FormControl>
                <Input placeholder="Route A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bus_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned Bus</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                  value={field.value || ""}
                >
                  <option value="">Select a bus</option>
                  {buses.map((bus) => (
                    <option key={bus.id} value={bus.id}>
                      {bus.number} ({bus.capacity} seats)
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create Route</Button>
      </form>
    </Form>
  );
}
