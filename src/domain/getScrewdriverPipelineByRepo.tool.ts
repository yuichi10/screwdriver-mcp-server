import { z } from "zod";
import { getScrewdriverPipelineByRepo as getScrewdriverPipelineByRepoFromApi } from "../infrastructure/screwdriverApi";

export const getScrewdriverPipelineByRepoInputSchema = z.object({
  orgName: z
    .string()
    .describe(
      "The organization name of the GitHub repository (e.g., yuichi10).",
    ),
  repoName: z
    .string()
    .describe(
      "The repository name of the GitHub repository (e.g., screwdriver-mcp-server).",
    ),
  jwtToken: z
    .string()
    .describe("The JWT token for Screwdriver API authentication."),
});

export const getScrewdriverPipelineByRepo = async (
  orgName: string,
  repoName: string,
  jwtToken: string,
): Promise<any> => {
  try {
    const pipeline = await getScrewdriverPipelineByRepoFromApi(
      orgName,
      repoName,
      jwtToken,
    );
    return pipeline;
  } catch (error) {
    console.error(
      "Error in domain layer for getScrewdriverPipelineByRepo:",
      error,
    );
    throw error;
  }
};
