import { AiTool } from '../types';
import { INITIAL_TOOLS } from '../constants';

export const searchAiTools = async (userQuery: string): Promise<AiTool[]> => {
  if (!userQuery.trim()) {
    return INITIAL_TOOLS;
  }

  try {
    // Call the serverless function
    // encodeURIComponent is crucial to handle special characters in the query
    const response = await fetch(`/api/search?q=${encodeURIComponent(userQuery)}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data: AiTool[] = await response.json();
    
    // Fallback to initial tools if API returns empty array (rare but possible)
    if (!Array.isArray(data) || data.length === 0) {
      return INITIAL_TOOLS;
    }

    return data;
  } catch (error) {
    console.error("Search service failed:", error);
    // Graceful fallback to local filtering if the API fails
    const lowerQuery = userQuery.toLowerCase();
    return INITIAL_TOOLS.filter(tool => 
      tool.name.toLowerCase().includes(lowerQuery) || 
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.category.toLowerCase().includes(lowerQuery)
    );
  }
};