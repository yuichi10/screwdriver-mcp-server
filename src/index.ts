import { setupSessionServer } from "./presentation/";

const port = 3000;
const app = setupSessionServer();

app.listen(port, () => {
  console.log(`MCP Server (Express) listening on http://localhost:${port}`);
});
