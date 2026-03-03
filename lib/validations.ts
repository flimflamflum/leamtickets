import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createTicketSchema = z.object({
  venue: z.enum(["SMACK", "NEON"], {
    error: "Please select a venue",
  }),
  eventName: z
    .string()
    .min(2, "Event name must be at least 2 characters")
    .max(100, "Event name must be under 100 characters"),
  eventDate: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime()) && date > new Date();
  }, "Event date must be a valid future date"),
  ticketType: z
    .string()
    .min(2, "Ticket type must be at least 2 characters")
    .max(50, "Ticket type must be under 50 characters"),
  originalPrice: z
    .number()
    .positive("Original price must be positive")
    .max(500, "Price seems too high — contact us if needed"),
  resalePrice: z
    .number()
    .positive("Resale price must be positive")
    .max(500, "Price seems too high — contact us if needed"),
  imageUrl: z.string().url("Please upload a valid ticket image"),
  description: z.string().max(500, "Description must be under 500 characters").optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateTicketInput = z.infer<typeof createTicketSchema>;
