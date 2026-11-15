
import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(200, "Title must be less than 200 characters"),

  description: z.string().optional(),

  priority: z.enum(["low", "medium", "high"]),

  due_at: z.string().optional(),
});

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;
