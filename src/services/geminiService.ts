import { AiTool } from '../types';
import { INITIAL_TOOLS } from '../constants';

export const searchAiTools = async (userQuery: string): Promise<AiTool[]> => {
  if (!userQuery.trim()) {
    return INITIAL_TOOLS;
  }

  try {
    // Determine API URL (relative for Vercel, absolute for dev if needed)
    const apiUrl = `/api/search?q=${encodeURIComponent(userQuery)}`;
    
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      console.warn("API returned empty data, using fallback");
      return INITIAL_TOOLS;
    }

    return data;
  } catch (error) {
    console.error("Search Service Error:", error);
    
    // Client-side fallback for demo/offline/error purposes
    const lowerQuery = userQuery.toLowerCase();
    const results = INITIAL_TOOLS.filter(tool => 
      tool.name.toLowerCase().includes(lowerQuery) || 
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.category.toLowerCase().includes(lowerQuery)
    );
    
    return results; 
  }
};