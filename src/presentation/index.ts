import express, { Express } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { randomUUID } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { getMCPServer } from "./server";

export const setupSessionServer = (): Express => {
  const app = express();
  app.use(express.json());
  const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

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
          // DNS rebinding protection is disabled by default for backwards compatibility. If you are running this server
          // locally, make sure to set:
          // enableDnsRebindingProtection: true,
          // allowedHosts: ['127.0.0.1'],
        });
        // Clean up transport when closed
        transport.onclose = () => {
          if (transport.sessionId) {
            delete transports[transport.sessionId];
          }
        };
        const server = getMCPServer();
        await server.connect(transport);
      } else {
        // Invalid request
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
      // Handle the request
      await transport.handleRequest(req, res, req.body);
    }
  );

  // Reusable handler for GET and DELETE requests
  const handleSessionRequest = async (
    req: express.Request,
    res: express.Response
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

  // Handle GET requests for server-to-client notifications via SSE
  app.get(["/mcp", "/mcp/"], handleSessionRequest);
  // app.get("/mcp", async (req, res) => {
  //   const transport = new StreamableHTTPServerTransport({
  //     sessionIdGenerator: () => randomUUID(),
  //     onsessioninitialized: (sessionId) => {
  //       transports[sessionId] = transport;
  //     },
  //   });

  //   transport.onclose = () => {
  //     if (transport.sessionId) {
  //       delete transports[transport.sessionId];
  //     }
  //   };

  //   const server = getMCPServer();
  //   await server.connect(transport);

  //   await transport.handleRequest(req, res);
  // });

  // Handle DELETE requests for session termination
  app.delete(["/mcp", "/mcp/"], handleSessionRequest);

  return app;
};

export const setupStatelessServer = (): Express => {
  const app = express();
  app.use(express.json());

  app.post(
    ["/mcp", "/mcp/"],
    async (req: express.Request, res: express.Response) => {
      // In stateless mode, create a new instance of transport and server for each request
      // to ensure complete isolation. A single instance would cause request ID collisions
      // when multiple clients connect concurrently.

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
    }
  );

  // SSE notifications not supported in stateless mode
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
        })
      );
    }
  );

  // Session termination not needed in stateless mode
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
        })
      );
    }
  );

  return app;
};
