import { getScrewdriverJwt } from "../screwdriverApi";
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