import {
  McpServer,
  ReadResourceCallback,
  ReadResourceTemplateCallback,
  ResourceTemplate,
  ResourceMetadata,
  ToolCallback,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { addTool } from "../application/add.tool";
import { addToolInputSchema } from "../domain/add.tool";
import { createScrewdriverJwt } from "../application/createScrewdriverJwt.tool";
import { createScrewdriverJwtInputSchema } from "../domain/createScrewdriverJwt.tool";
import { showInformation } from "../application/information.resource";

export type MCPTool = {
  name: string;
  title: string;
  description?: string;
  input?: any;
  output?: any;
  annotations?: any;
  handler: (...args: any[]) => any;
};

export type MCPResource = {
  name: string;
  template: any;
  config: {
    title: string;
    description?: string;
  };
  handler: (...args: any[]) => any;
};

export let tools: MCPTool[] = [];
export let resources: MCPResource[] = [];

export const setupMCPServer = () => {
  tools = [
    {
      name: "add",
      title: "Addition Tool",
      description: "Add two numbers",
      input: addToolInputSchema,
      handler: addTool.handler,
    },
    {
      name: "createScrewdriverJwt",
      title: "Create Screwdriver JWT",
      description: "Creates a JWT for Screwdriver API authentication.",
      input: createScrewdriverJwtInputSchema,
      handler: createScrewdriverJwt.handler,
    },
  ];
  resources = [
    {
      name: "reference",
      template: new ResourceTemplate("reference://info", { list: undefined }),
      config: {
        title: "Reference Information",
        description: "Provides static information.",
      },
      handler: showInformation,
    },
  ];
};

export const getMCPServer = () => {
  const server = new McpServer({
    name: "screwdriver-server",
    version: "1.0.0",
  });

  for (const tool of tools) {
    server.registerTool(
      tool.name,
      {
        title: tool.title,
        description: tool.description,
        inputSchema: tool.input,
        outputSchema: tool.output,
        annotations: tool.annotations,
      },
      tool.handler
    );
  }

  for (const resource of resources) {
    server.registerResource(
      resource.name,
      resource.template,
      resource.config,
      resource.handler
    );
  }
  return server;
};
