import { createScrewdriverJwtInputSchema } from "../domain/createScrewdriverJwt.tool";
import { getScrewdriverJwt } from "../infrastructure/screwdriverApi";
import { serverConfig } from "../config";

export const createScrewdriverJwt = {
  schema: createScrewdriverJwtInputSchema,
  handler: async ({ apiToken }: { apiToken?: string }) => {
    const tokenToUse = apiToken || serverConfig.token;
    if (!tokenToUse) {
      return {
        content: [
          {
            type: "text" as const,
            text: "Error: No API token provided and no token configured.",
          },
        ],
      };
    }
    try {
      const jwtToken = await getScrewdriverJwt(tokenToUse);
      return { content: [{ type: "text" as const, text: jwtToken }] };
    } catch (error) {
      console.error("Error creating Screwdriver JWT:", error);
      return {
        content: [
          { type: "text" as const, text: `Error: ${(error as any).message}` },
        ],
      };
    }
  },
};
