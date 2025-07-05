import { getScrewdriverJwt, getScrewdriverPipelineByRepo } from "../screwdriverApi";
import { serverConfig } from "../../config";

jest.mock("../../config", () => ({
  serverConfig: {
    api_url: "http://mock-screwdriver-api.com",
  },
}));

describe("getScrewdriverJwt", () => {
  const mockApiToken = "test_api_token";
  const mockJwt = "mock_jwt_token";

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: mockJwt }),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return a JWT token when the API call is successful", async () => {
    const jwt = await getScrewdriverJwt(mockApiToken);
    expect(jwt).toBe(mockJwt);
    expect(global.fetch).toHaveBeenCalledWith(
      `${serverConfig.api_url}/auth/token?api_token=${mockApiToken}`
    );
  });

  it("should throw an error when the API call fails", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
      })
    ) as jest.Mock;

    await expect(getScrewdriverJwt(mockApiToken)).rejects.toThrow(
      "Failed to get Screwdriver JWT: HTTP error! status: 400"
    );
  });

  it("should throw an error when the fetch call throws an error", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Network error"))) as jest.Mock;

    await expect(getScrewdriverJwt(mockApiToken)).rejects.toThrow(
      "Failed to get Screwdriver JWT: Network error"
    );
  });
});

describe("getScrewdriverPipelineByRepo", () => {
  const mockOrgName = "owner";
  const mockRepoName = "repo";
  const mockPipeline = [{ id: 123, name: "test-pipeline" }];

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPipeline),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockJwt = "mock_jwt_token";

  it("should return pipeline data when the API call is successful", async () => {
    const pipeline = await getScrewdriverPipelineByRepo(mockOrgName, mockRepoName, mockJwt);
    expect(pipeline).toEqual(mockPipeline);
    expect(global.fetch).toHaveBeenCalledWith(
      `${serverConfig.api_url}/pipelines?search=${encodeURIComponent(`${mockOrgName}/${mockRepoName}`)}`,
      {
        headers: {
          'Authorization': `Bearer ${mockJwt}`
        }
      }
    );
  });

  it("should throw an error when the API call fails", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
      })
    ) as jest.Mock;

    await expect(getScrewdriverPipelineByRepo(mockOrgName, mockRepoName, mockJwt)).rejects.toThrow(
      "Failed to get Screwdriver pipeline by repo: HTTP error! status: 400"
    );
  });

  it("should throw an error when the fetch call throws an error", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Network error"))) as jest.Mock;

    await expect(getScrewdriverPipelineByRepo(mockOrgName, mockRepoName, mockJwt)).rejects.toThrow(
      "Failed to get Screwdriver pipeline by repo: Network error"
    );
  });
});
