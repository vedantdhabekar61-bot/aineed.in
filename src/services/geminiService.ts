import { AiTool } from '../types';
import { INITIAL_TOOLS } from '../constants';

export const searchAiTools = async (userQuery: string): Promise<AiTool[]> => {
  if (!userQuery.trim()) {
    return INITIAL_TOOLS;
  }

  try {
    // Check if we are in development (localhost) vs production
    // Vercel serverless functions are at /api/...
    // Locally with Vite, this path doesn't exist unless proxied or using `vercel dev`
    const apiUrl = `/api/search?q=${encodeURIComponent(userQuery)}`;
    
    const response = await fetch(apiUrl);

    if (!response.ok) {
      // Try to get error details
      const errorData = await response.json().catch(() => ({}));
      console.error("Server Error:", response.status, response.statusText, errorData);
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      console.warn("API returned empty array or invalid format, using fallback.");
      return INITIAL_TOOLS;
    }

    return data;
  } catch (error) {
    console.error("Search failed, using local fallback.", error);
    
    // Fallback logic for local development or API failure
    const lowerQuery = userQuery.toLowerCase();
    const results = INITIAL_TOOLS.filter(tool => 
      tool.name.toLowerCase().includes(lowerQuery) || 
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.category.toLowerCase().includes(lowerQuery)
    );
    
    // If fallback finds nothing, stick to initial tools (or could return empty)
    // Returning empty allows the UI to show "No results found" which is more accurate than showing everything.
    return results; 
  }
};