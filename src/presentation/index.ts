import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { addTool } from '../application/addTool';

export const createMcpServer = () => {
  const server = new McpServer({ name: 'demo-server', version: '1.0.0' });

  server.registerTool('add', {
    title: 'Addition Tool',
    description: 'Add two numbers',
    inputSchema: addTool.schema,
  }, addTool.handler);

  server.registerResource(
    'reference',
    new ResourceTemplate('reference://info', { list: undefined }),
    {
      title: 'Reference Information',
      description: 'Provides static information.',
    },
    async () => ({
      contents: [{ uri: 'reference://info', text: 'This is some reference information.' }],
    })
  );

  return server;
};
