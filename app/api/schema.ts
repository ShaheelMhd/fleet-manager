import { z } from "zod";

export const busSchema = z.object({
  number: z.string().min(1, "Bus number is required"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  status: z.enum(["active", "maintenance", "idle"]).default("active"),
  route_id: z.string().optional().nullable(),
  maintenance_notes: z.string().optional(),
});

export const routeSchema = z.object({
  name: z.string().min(1, "Route name is required"),
  stops: z.array(z.string()).default([]),
});

export const studentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  student_id: z.string().min(1, "Student ID is required"),
  route_id: z.string().optional().nullable(),
  bus_id: z.string().optional().nullable(),
  seat_number: z.coerce.number().optional().nullable(),
});

export const userSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long." }),
    email: z.string().email({ message: "Email is not valid." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .max(100, { message: "Password is too long." })
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      )
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string({ message: "Field is required." }).optional(),
    role: z.enum(["user", "admin"]).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
