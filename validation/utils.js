import { z } from "zod/v4";

export const mongoDbIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ID format");

export const paginationSchema = z.object({
  page: z
    .string()
    .default("1")
    .transform(Number)
    .pipe(z.number().int().min(1, "Page must be a positive integer")),
  limit: z
    .string()
    .default("10")
    .transform(Number)
    .pipe(
      z
        .number()
        .int()
        .min(1, "Limit must be a positive integer")
        .max(100, "Limit cannot exceed 100")
    ),
});
export const sortSchema = z.object({
  sortBy: z.string().optional().default("createdAt"),
  sortOrder: z
    .enum(["asc", "desc"])
    .optional()
    .default("desc")
    .transform((val) => (val === "asc" ? 1 : -1)),
});
export const searchSchema = z.object({
  search: z.string().optional(),
  category: mongoDbIdSchema.optional(),
});
export const filterSchema = sortSchema.and(paginationSchema).and(searchSchema);
export const idParamsSchema = z.object({
  id: mongoDbIdSchema,
});
