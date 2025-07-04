import { setupServer, setupStudioServer } from "./presentation/";
import { serverConfig } from "./config";

const config = serverConfig;

const port = config.port || 3000;

if (config.server === "studio") {
  setupStudioServer();
} else {
  const app = setupServer(config.stateful);

  app.listen(port, () => {
    console.log(`MCP Server (Express) listening on http://localhost:${port}`);
  });
}
