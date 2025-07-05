import { getScrewdriverPipelineById } from "../getScrewdriverPipelineById.tool";
import { getScrewdriverPipelineById as getScrewdriverPipelineByIdFromApi } from "../../infrastructure/screwdriverApi";

jest.mock("../../infrastructure/screwdriverApi", () => ({
  getScrewdriverPipelineById: jest.fn(),
}));

describe("getScrewdriverPipelineById.tool (Domain Layer)", () => {
  const mockPipelineId = 123;
  const mockJwt = "mock_jwt_token";
  const mockPipeline = { id: mockPipelineId, name: "test-pipeline-by-id" };

  beforeEach(() => {
    (getScrewdriverPipelineByIdFromApi as jest.Mock).mockClear();
  });

  it("should return pipeline data from the infrastructure layer", async () => {
    (getScrewdriverPipelineByIdFromApi as jest.Mock).mockResolvedValue(mockPipeline);

    const pipeline = await getScrewdriverPipelineById(mockPipelineId, mockJwt);

    expect(pipeline).toEqual(mockPipeline);
    expect(getScrewdriverPipelineByIdFromApi).toHaveBeenCalledWith(mockPipelineId, mockJwt);
  });

  it("should throw an error if the infrastructure layer throws an error", async () => {
    const mockError = new Error("Infrastructure error");
    (getScrewdriverPipelineByIdFromApi as jest.Mock).mockRejectedValue(mockError);

    await expect(getScrewdriverPipelineById(mockPipelineId, mockJwt)).rejects.toThrow(
      "Infrastructure error"
    );
    expect(getScrewdriverPipelineByIdFromApi).toHaveBeenCalledWith(mockPipelineId, mockJwt);
  });
});