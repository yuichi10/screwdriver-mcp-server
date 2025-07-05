import { serverConfig } from "../config";

export const getScrewdriverJwt = async (apiToken: string): Promise<string> => {
  const apiUrl = serverConfig.api_url;
  const url = `${apiUrl.replace(/\/+$/, "")}/auth/token?api_token=${apiToken}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("Error fetching Screwdriver JWT:", error);
    throw new Error(`Failed to get Screwdriver JWT: ${(error as any).message}`);
  }
};

export const getScrewdriverPipelineByRepo = async (
  orgName: string,
  repoName: string,
  jwtToken: string
): Promise<any> => {
  const apiUrl = serverConfig.api_url;
  const url = `${apiUrl.replace(
    /\/+$/,
    ""
  )}/pipelines?search=${encodeURIComponent(`${orgName}/${repoName}`)}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Screwdriver pipeline by repo:", error);
    throw new Error(
      `Failed to get Screwdriver pipeline by repo: ${(error as any).message}`
    );
  }
};

export const getScrewdriverPipelineById = async (
  pipelineId: number,
  jwtToken: string
): Promise<any> => {
  const apiUrl = serverConfig.api_url;
  const url = `${apiUrl.replace(/\/+$/, "")}/pipelines/${pipelineId}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Screwdriver pipeline by ID:", error);
    throw new Error(
      `Failed to get Screwdriver pipeline by ID: ${(error as any).message}`
    );
  }
};
