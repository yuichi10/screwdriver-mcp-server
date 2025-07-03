import { setupServer } from "./presentation/";

const port = 3000;
const app = setupServer();

app.listen(port, () => {
  console.log(`MCP Server (Express) listening on http://localhost:${port}`);
});
