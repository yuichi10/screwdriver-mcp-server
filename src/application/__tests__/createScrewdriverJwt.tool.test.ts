import { createScrewdriverJwt } from "../createScrewdriverJwt.tool";
import { getScrewdriverJwt } from "../../infrastructure/screwdriverApi";

jest.mock("../../config", () => ({
  serverConfig: {
    token: undefined, // Default to undefined for most tests
  },
}));

import { serverConfig } from "../../config";

jest.mock("../../infrastructure/screwdriverApi", () => ({
  getScrewdriverJwt: jest.fn(),
}));

describe("createScrewdriverJwt.tool", () => {
  const mockApiToken = "test_api_token";
  const mockConfigToken = "config_token";
  const mockJwt = "mock_jwt_token";

  beforeEach(() => {
    (getScrewdriverJwt as jest.Mock).mockClear();
    // Reset serverConfig.token for each test
    (serverConfig as any).token = undefined;
  });

  it("should return a JWT token when apiToken is provided", async () => {
    (getScrewdriverJwt as jest.Mock).mockResolvedValue(mockJwt);

    const result = await createScrewdriverJwt.handler({ apiToken: mockApiToken });

    expect(getScrewdriverJwt).toHaveBeenCalledWith(mockApiToken);
    expect(result).toEqual({ content: [{ type: "text", text: mockJwt }] });
  });

  it("should return a JWT token when apiToken is not provided but config token is available", async () => {
    (serverConfig as any).token = mockConfigToken;
    (getScrewdriverJwt as jest.Mock).mockResolvedValue(mockJwt);

    const result = await createScrewdriverJwt.handler({});

    expect(getScrewdriverJwt).toHaveBeenCalledWith(mockConfigToken);
    expect(result).toEqual({ content: [{ type: "text", text: mockJwt }] });
  });

  it("should return an error when no apiToken or config token is available", async () => {
    const result = await createScrewdriverJwt.handler({});

    expect(getScrewdriverJwt).not.toHaveBeenCalled();
    expect(result).toEqual({ content: [{ type: "text", text: "Error: No API token provided and no token configured." }] });
  });

  it("should return an error message when getScrewdriverJwt fails", async () => {
    const errorMessage = "Failed to get JWT";
    (getScrewdriverJwt as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const result = await createScrewdriverJwt.handler({ apiToken: mockApiToken });

    expect(getScrewdriverJwt).toHaveBeenCalledWith(mockApiToken);
    expect(result).toEqual({ content: [{ type: "text", text: `Error: ${errorMessage}` }] });
  });
});