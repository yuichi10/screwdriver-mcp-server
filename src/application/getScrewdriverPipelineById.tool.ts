import { getScrewdriverPipelineById as getScrewdriverPipelineByIdFromDomain, getScrewdriverPipelineByIdInputSchema } from "../domain/getScrewdriverPipelineById.tool";

export const getScrewdriverPipelineById = {
  schema: getScrewdriverPipelineByIdInputSchema,
  handler: async ({
    pipelineId,
    jwtToken,
  }: {
    pipelineId: number;
    jwtToken: string;
  }) => {
    try {
      const pipeline = await getScrewdriverPipelineByIdFromDomain(
        pipelineId,
        jwtToken
      );
      return { content: [{ type: "text" as const, text: JSON.stringify(pipeline) }] };
    } catch (error) {
      console.error(
        "Error in application layer for getScrewdriverPipelineById:",
        error
      );
      throw error;
    }
  },
};