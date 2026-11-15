import { z } from "zod";

export const signupSchema = z
  .object({
    full_name: z
      .string()
      .min(2, "Name must contain at least 2 characters")
      .max(100, "Name is too long"),

    email: z
      .string()
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(8, "Password must contain at least 8 characters"),

    confirm_password: z.string(),
  })
  .refine(
    (data) => data.password === data.confirm_password,
    {
      message: "Passwords do not match",
      path: ["confirm_password"],
    }
  );

export type SignupFormValues = z.infer<typeof signupSchema>;