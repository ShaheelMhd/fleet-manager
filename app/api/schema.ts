import { z } from "zod";

export const busSchema = z.object({
  number: z.string().min(1, "Bus number is required"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  status: z.enum(["active", "maintenance", "idle", "scheduled"]).default("active"),
  route_id: z.string().optional().nullable(),
  driver_id: z.string().optional().nullable(),
  maintenance_notes: z.string().optional(),
  next_maintenance_date: z.string().optional().nullable(),
  last_odometer_reading: z.coerce.number().optional().nullable(),
});

export const routeSchema = z.object({
  name: z.string().min(1, "Route name is required"),
  stops: z.array(z.string()).default([]),
});

export const driverSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone_number: z.string().optional().nullable(),
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
      .min(3, { message: "Name must be at least 3 characters long." })
      .max(50, { message: "Name is too long (max 50 characters)." }),
    email: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .max(100, { message: "Password is too long." })
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character."
      )
      .regex(/[0-9]/, "Password must contain at least one number."),
    confirmPassword: z.string().min(1, { message: "Confirm password is required." }),
    role: z.enum(["user", "admin"]).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please enter a valid email address." }),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .max(100, { message: "Password is too long." })
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character."
      )
      .regex(/[0-9]/, "Password must contain at least one number."),
    confirmPassword: z.string().min(1, { message: "Confirm password is required." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
