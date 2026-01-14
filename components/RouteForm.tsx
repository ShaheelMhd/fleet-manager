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

interface RouteFormProps {
  onSuccess?: () => void;
}

type RouteFormValues = z.infer<typeof routeSchema>;

export function RouteForm({ onSuccess }: RouteFormProps) {
  const router = useRouter();

  const form = useForm<RouteFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(routeSchema) as any,
    defaultValues: {
      name: "",
      stops: [],
    },
  });

  async function onSubmit(values: RouteFormValues) {
    try {
      const response = await fetch("/api/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
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
        <Button type="submit">Create Route</Button>
      </form>
    </Form>
  );
}
