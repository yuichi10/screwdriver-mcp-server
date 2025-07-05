import express, { Express } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { randomUUID } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { getMCPServer, setupMCPServer } from "./server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

export const setupStudioServer = async () => {
  console.log("Setting up Studio Server");
  setupMCPServer();
  const server = getMCPServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
};

export const setupServer = (stateful: boolean): Express => {
  if (stateful) {
    return setupStatefulServer();
  } else {
    return setupStatelessServer();
  }
};

const setupStatefulServer = (): Express => {
  const app = express();
  app.use(express.json());
  const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};
  setupMCPServer();

  app.post(
    ["/mcp", "/mcp/"],
    async (req: express.Request, res: express.Response) => {
      console.log("statefull MCP request received");
      const sessionId = req.headers["mcp-session-id"] as string | undefined;
      let transport: StreamableHTTPServerTransport;

      if (sessionId && transports[sessionId]) {
        // Reuse existing transport
        transport = transports[sessionId];
      } else if (!sessionId && isInitializeRequest(req.body)) {
        // New initialization request
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (sessionId) => {
            // Store the transport by session ID
            transports[sessionId] = transport;
          },
        });
        transport.onclose = () => {
          if (transport.sessionId) {
            delete transports[transport.sessionId];
          }
        };
        const server = getMCPServer();
        await server.connect(transport);
      } else {
        res.status(400).json({
          jsonrpc: "2.0",
          error: {
            code: -32000,
            message: "Bad Request: No valid session ID provided",
          },
          id: null,
        });
        return;
      }
      await transport.handleRequest(req, res, req.body);
    },
  );

  const handleSessionRequest = async (
    req: express.Request,
    res: express.Response,
  ) => {
    console.log("Received handleSessionRequest");
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (!sessionId || !transports[sessionId]) {
      res.status(400).send("Invalid or missing session ID");
      return;
    }

    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
  };

  app.get(["/mcp", "/mcp/"], handleSessionRequest);
  app.delete(["/mcp", "/mcp/"], handleSessionRequest);

  return app;
};

const setupStatelessServer = (): Express => {
  const app = express();
  app.use(express.json());

  app.post(
    ["/mcp", "/mcp/"],
    async (req: express.Request, res: express.Response) => {
      try {
        const server = getMCPServer();
        const transport: StreamableHTTPServerTransport =
          new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
          });
        res.on("close", () => {
          console.log("Request closed");
          transport.close();
          server.close();
        });
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
      } catch (error) {
        console.error("Error handling MCP request:", error);
        if (!res.headersSent) {
          res.status(500).json({
            jsonrpc: "2.0",
            error: {
              code: -32603,
              message: "Internal server error",
            },
            id: null,
          });
        }
      }
    },
  );

  app.get(
    ["/mcp", "/mcp/"],
    async (req: express.Request, res: express.Response) => {
      console.log("Received GET MCP request");
      res.writeHead(405).end(
        JSON.stringify({
          jsonrpc: "2.0",
          error: {
            code: -32000,
            message: "Method not allowed.",
          },
          id: null,
        }),
      );
    },
  );

  app.delete(
    ["/mcp", "/mcp/"],
    async (req: express.Request, res: express.Response) => {
      console.log("Received DELETE MCP request");
      res.writeHead(405).end(
        JSON.stringify({
          jsonrpc: "2.0",
          error: {
            code: -32000,
            message: "Method not allowed.",
          },
          id: null,
        }),
      );
    },
  );

  return app;
};
