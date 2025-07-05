import {
  getScrewdriverPipelineByRepo as getScrewdriverPipelineByRepoFromDomain,
  getScrewdriverPipelineByRepoInputSchema,
} from "../domain/getScrewdriverPipelineByRepo.tool";

export const getScrewdriverPipelineByRepo = {
  schema: getScrewdriverPipelineByRepoInputSchema,
  handler: async ({
    orgName,
    repoName,
    jwtToken,
  }: {
    orgName: string;
    repoName: string;
    jwtToken: string;
  }) => {
    try {
      const pipeline = await getScrewdriverPipelineByRepoFromDomain(
        orgName,
        repoName,
        jwtToken,
      );
      return {
        content: [{ type: "text" as const, text: JSON.stringify(pipeline) }],
      };
    } catch (error) {
      console.error(
        "Error in application layer for getScrewdriverPipelineByRepo:",
        error,
      );
      throw error;
    }
  },
};
