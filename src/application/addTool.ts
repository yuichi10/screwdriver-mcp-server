import { addToolInputSchema } from '../domain/addTool';

export const addTool = {
  schema: addToolInputSchema,
  handler: async ({ a, b }: { a: number; b: number }) => {
    return { content: [{ type: 'text' as const, text: String(a + b) }] };
  },
};
