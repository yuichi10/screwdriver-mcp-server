import { z } from "zod";

export const createScrewdriverJwtInputSchema = z.object({
  apiToken: z
    .string()
    .optional()
    .describe(
      "Optional: The Screwdriver API token. If not provided, the token from server configuration will be used.",
    ),
});
