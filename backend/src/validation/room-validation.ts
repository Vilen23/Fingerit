import z from "zod"

export const roomInputs = z.object({
  name: z.string(),
  password: z.string()
})
