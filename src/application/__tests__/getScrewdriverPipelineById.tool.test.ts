import { getScrewdriverPipelineById } from "../getScrewdriverPipelineById.tool";
import { getScrewdriverPipelineById as getScrewdriverPipelineByIdFromDomain } from "../../domain/getScrewdriverPipelineById.tool";

jest.mock("../../domain/getScrewdriverPipelineById.tool", () => ({
  getScrewdriverPipelineById: jest.fn(),
}));

describe("getScrewdriverPipelineById.tool (Application Layer)", () => {
  const mockPipelineId = 123;
  const mockJwt = "mock_jwt_token";
  const mockPipeline = { id: mockPipelineId, name: "test-pipeline-by-id" };

  beforeEach(() => {
    (getScrewdriverPipelineByIdFromDomain as jest.Mock).mockClear();
  });

  it("should return pipeline data from the domain layer", async () => {
    (getScrewdriverPipelineByIdFromDomain as jest.Mock).mockResolvedValue(
      mockPipeline,
    );

    const result = await getScrewdriverPipelineById.handler({
      pipelineId: mockPipelineId,
      jwtToken: mockJwt,
    });

    expect(result.content[0].text).toEqual(JSON.stringify(mockPipeline));
    expect(getScrewdriverPipelineByIdFromDomain).toHaveBeenCalledWith(
      mockPipelineId,
      mockJwt,
    );
  });

  it("should throw an error if the domain layer throws an error", async () => {
    const mockError = new Error("Domain error");
    (getScrewdriverPipelineByIdFromDomain as jest.Mock).mockRejectedValue(
      mockError,
    );

    await expect(
      getScrewdriverPipelineById.handler({
        pipelineId: mockPipelineId,
        jwtToken: mockJwt,
      }),
    ).rejects.toThrow("Domain error");
    expect(getScrewdriverPipelineByIdFromDomain).toHaveBeenCalledWith(
      mockPipelineId,
      mockJwt,
    );
  });
});
