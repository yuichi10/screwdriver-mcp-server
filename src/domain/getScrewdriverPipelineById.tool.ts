import { z } from "zod";
import { getScrewdriverPipelineById as getScrewdriverPipelineByIdFromApi } from "../infrastructure/screwdriverApi";

export const getScrewdriverPipelineByIdInputSchema = z.object({
  pipelineId: z.number().describe("The ID of the Screwdriver pipeline."),
  jwtToken: z
    .string()
    .describe("The JWT token for Screwdriver API authentication."),
});

export const getScrewdriverPipelineById = async (
  pipelineId: number,
  jwtToken: string,
): Promise<any> => {
  try {
    const pipeline = await getScrewdriverPipelineByIdFromApi(
      pipelineId,
      jwtToken,
    );
    return pipeline;
  } catch (error) {
    console.error(
      "Error in domain layer for getScrewdriverPipelineById:",
      error,
    );
    throw error;
  }
};
