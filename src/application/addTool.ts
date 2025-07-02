import { addToolInputShape } from '../domain/toolInput';

export const addTool = {
  schema: addToolInputShape,
  handler: async ({ a, b }: { a: number; b: number }) => {
    return { content: [{ type: 'text' as const, text: String(a + b) }] };
  },
};
