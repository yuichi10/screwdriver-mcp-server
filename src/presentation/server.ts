import {
  McpServer,
  ReadResourceCallback,
  ReadResourceTemplateCallback,
  ResourceTemplate,
  ResourceMetadata,
  ToolCallback,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { addTool } from "../application/add.tool";
import { createScrewdriverJwt } from "../application/createScrewdriverJwt.tool";
import { showInformation } from "../application/information.resource";
import { getScrewdriverPipelineByRepo } from "../application/getScrewdriverPipelineByRepo.tool";
import { getScrewdriverPipelineById } from "../application/getScrewdriverPipelineById.tool";

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
      input: addTool.schema,
      handler: addTool.handler,
    },
    {
      name: "createScrewdriverJwt",
      title: "Create Screwdriver JWT",
      description: "Creates a JWT for Screwdriver API authentication.",
      input: createScrewdriverJwt.schema,
      handler: createScrewdriverJwt.handler,
    },
    {
      name: "getScrewdriverPipelineByRepo",
      title: "Get Screwdriver Pipeline by Repository",
      description:
        "Retrieves Screwdriver pipeline information using GitHub repository organization and name.",
      input: getScrewdriverPipelineByRepo.schema,
      handler: getScrewdriverPipelineByRepo.handler,
    },
    {
      name: "getScrewdriverPipelineById",
      title: "Get Screwdriver Pipeline by ID",
      description: "Retrieves Screwdriver pipeline information using a pipeline ID.",
      input: getScrewdriverPipelineById.schema,
      handler: getScrewdriverPipelineById.handler,
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
        inputSchema: tool.input.shape,
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
