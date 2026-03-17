import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email({ message: "Email is not valid field" }),
  password: z
    .string()
    .min(8, { message: "Password is required and must be 8 character" }),
});

export const loginSchema = authSchema;
export const registerSchema = authSchema.extend({
  name: z.string().min(1).max(255).default(""),
});

export const coinDetailSchema = z.object({
  type: z.string(),
  count: z.number().int().nonnegative(),
  value: z.number().nonnegative(),
});

export const historySaveSchema = z.object({
  count: z.number().int().positive(),
  totalValue: z.number().nonnegative(),
  details: z.array(coinDetailSchema).min(1),
  // ไม่ต้องส่ง labeledImage เพื่อลดขนาด payload
});

export type LoginSchema = z.output<typeof loginSchema>;
export type RegisterSchema = z.output<typeof registerSchema>;
export type HistorySaveSchema = z.output<typeof historySaveSchema>;
