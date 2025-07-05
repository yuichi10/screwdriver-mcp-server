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
