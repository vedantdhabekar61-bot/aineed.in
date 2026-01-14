import { AiTool } from '../types';
import { INITIAL_TOOLS } from '../constants';

export const searchAiTools = async (userQuery: string): Promise<AiTool[]> => {
  if (!userQuery.trim()) {
    return INITIAL_TOOLS;
  }

  try {
    // Call the backend API route
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: userQuery }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const tools: AiTool[] = await response.json();
    return tools;

  } catch (error) {
    console.error("Search Service Error:", error);
    // Fallback to initial tools on error ensures the UI doesn't break
    return INITIAL_TOOLS;
  }
};