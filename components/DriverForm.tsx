"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { driverSchema } from "@/app/api/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Bus, PaginatedResponse } from "@/types";

type DriverFormValues = z.infer<typeof driverSchema> & { bus_id?: string };

interface DriverFormProps {
  onSuccess?: () => void;
}

export function DriverForm({ onSuccess }: DriverFormProps) {
  const [loading, setLoading] = useState(false);
  const [buses, setBuses] = useState<Bus[]>([]);

  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema.extend({ bus_id: z.string().optional() })),
    defaultValues: {
      name: "",
      phone_number: "",
      bus_id: "",
    },
  });

  useEffect(() => {
    fetch("/api/buses?limit=100")
      .then((res) => res.json())
      .then((resData: PaginatedResponse<Bus>) => {
        setBuses(resData.data || []);
      })
      .catch((err) => console.error("Error fetching buses:", err));
  }, []);

  async function onSubmit(data: DriverFormValues) {
    setLoading(true);
    try {
      const { bus_id, ...driverData } = data;
      
      const response = await fetch("/api/drivers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(driverData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add driver");
      }

      const newDriver = await response.json();

      if (bus_id && bus_id !== "none") {
        const assignResponse = await fetch(`/api/buses/${bus_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ driver_id: newDriver.id }),
        });

        if (!assignResponse.ok) {
          toast.warning("Driver created, but bus assignment failed.");
        }
      }

      toast.success("Driver added successfully");
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
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
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+1 234 567 890" {...field} value={field.value || ""} />
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
              <FormLabel>Assign Bus (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bus" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {buses.map((bus) => (
                    <SelectItem key={bus.id} value={bus.id}>
                      Bus {bus.number} {bus.driver_id ? "(Occupied)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Driver
        </Button>
      </form>
    </Form>
  );
}
