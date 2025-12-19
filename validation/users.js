import z from "zod/v4";

export const loginSchema = z.object({
  email: z.email("Email must be valid"),
  password: z
    .string()
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/,
      "Password isn't strong enough"
    ),
});

export const userSchema = z.object({
  name: z
    .string()
    .min(3, "Name must have at least 3 letters")
    .max(70, "Name must have at most 70 letters"),
  email: z.email("Email must be valid"),
  password: z
    .string()
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/,
      "Password isn't strong enough"
    ),
});

export const fullUserSchema = userSchema.extend({
  role: z.enum(["Admin", "User"]),
});
