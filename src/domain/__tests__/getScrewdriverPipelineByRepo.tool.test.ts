import { getScrewdriverPipelineByRepo } from "../getScrewdriverPipelineByRepo.tool";
import { getScrewdriverPipelineByRepo as getScrewdriverPipelineByRepoFromApi } from "../../infrastructure/screwdriverApi";

jest.mock("../../infrastructure/screwdriverApi", () => ({
  getScrewdriverPipelineByRepo: jest.fn(),
}));

describe("getScrewdriverPipelineByRepo", () => {
  const mockOrgName = "owner";
  const mockRepoName = "repo";
  const mockJwt = "mock_jwt_token";
  const mockPipeline = [{ id: 123, name: "test-pipeline" }];

  beforeEach(() => {
    (getScrewdriverPipelineByRepoFromApi as jest.Mock).mockResolvedValue(
      mockPipeline,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return pipeline data from the infrastructure layer", async () => {
    const pipeline = await getScrewdriverPipelineByRepo(
      mockOrgName,
      mockRepoName,
      mockJwt,
    );
    expect(pipeline).toEqual(mockPipeline);
    expect(getScrewdriverPipelineByRepoFromApi).toHaveBeenCalledWith(
      mockOrgName,
      mockRepoName,
      mockJwt,
    );
  });

  it("should throw an error if the infrastructure layer throws an error", async () => {
    const mockError = new Error("Infrastructure error");
    (getScrewdriverPipelineByRepoFromApi as jest.Mock).mockRejectedValue(
      mockError,
    );

    await expect(
      getScrewdriverPipelineByRepo(mockOrgName, mockRepoName, mockJwt),
    ).rejects.toThrow("Infrastructure error");
    expect(getScrewdriverPipelineByRepoFromApi).toHaveBeenCalledWith(
      mockOrgName,
      mockRepoName,
      mockJwt,
    );
  });
});
