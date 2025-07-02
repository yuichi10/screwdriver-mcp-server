import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMcpServer } from './presentation/index';

const server = createMcpServer();
const transport = new StdioServerTransport();
server.connect(transport);
