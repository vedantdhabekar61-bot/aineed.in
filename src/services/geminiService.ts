import { AiTool } from '../types';

export const searchAiTools = async (
  userQuery: string
): Promise<AiTool[]> => {
  if (!userQuery.trim()) return [];

  const response = await fetch('/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: userQuery })
  });

  if (!response.ok) {
    throw new Error('Search failed');
  }

  const data = await response.json();
  return data.tools || [];
};
