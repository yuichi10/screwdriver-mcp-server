import { z } from "zod";

export const addToolInputSchema = z.object({
  a: z.number(),
  b: z.number(),
});
