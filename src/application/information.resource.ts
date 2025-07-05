export async function showInformation(): Promise<{ contents: { uri: string; text: string }[] }> {
  // Simulate fetching information based on the URI
    return {
      contents: [{ uri: 'reference://info', text: 'This is some reference information.' }],
    };
}
