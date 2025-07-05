import { getScrewdriverPipelineByRepo } from "../getScrewdriverPipelineByRepo.tool";
import { getScrewdriverPipelineByRepo as getScrewdriverPipelineByRepoFromDomain } from "../../domain/getScrewdriverPipelineByRepo.tool";

jest.mock("../../domain/getScrewdriverPipelineByRepo.tool", () => ({
  getScrewdriverPipelineByRepo: jest.fn(),
}));

describe("getScrewdriverPipelineByRepo", () => {
  const mockOrgName = "owner";
  const mockRepoName = "repo";
  const mockJwt = "mock_jwt_token";
  const mockPipeline = [{ id: 123, name: "test-pipeline" }];

  beforeEach(() => {
    (getScrewdriverPipelineByRepoFromDomain as jest.Mock).mockResolvedValue(
      mockPipeline,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return pipeline data from the domain layer", async () => {
    const result = await getScrewdriverPipelineByRepo.handler({
      orgName: mockOrgName,
      repoName: mockRepoName,
      jwtToken: mockJwt,
    });
    expect(result.content[0].text).toEqual(JSON.stringify(mockPipeline));
    expect(getScrewdriverPipelineByRepoFromDomain).toHaveBeenCalledWith(
      mockOrgName,
      mockRepoName,
      mockJwt,
    );
  });

  it("should throw an error if the domain layer throws an error", async () => {
    const mockError = new Error("Domain error");
    (getScrewdriverPipelineByRepoFromDomain as jest.Mock).mockRejectedValue(
      mockError,
    );

    await expect(
      getScrewdriverPipelineByRepo.handler({
        orgName: mockOrgName,
        repoName: mockRepoName,
        jwtToken: mockJwt,
      }),
    ).rejects.toThrow("Domain error");
    expect(getScrewdriverPipelineByRepoFromDomain).toHaveBeenCalledWith(
      mockOrgName,
      mockRepoName,
      mockJwt,
    );
  });
});
