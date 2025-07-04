import { setupSessionServer, setupStatelessServer } from "./presentation/";
import { serverConfig } from "./config";

let app;

const config = serverConfig;

const port = config.port || 3000;

if (config.stateful) {
  app = setupSessionServer();
} else {
  app = setupStatelessServer();
}

app.listen(port, () => {
  console.log(`MCP Server (Express) listening on http://localhost:${port}`);
});
