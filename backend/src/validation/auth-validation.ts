import z from "zod";

export const signUpInput = z.object({
  username: z.string(),
  email: z.string().email().optional(),
  password: z.string()
})

export const signInInput = z.object({
  username: z.string(),
  password: z.string()
})
