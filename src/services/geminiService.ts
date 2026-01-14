import { AiTool } from '../types';
import { INITIAL_TOOLS } from '../constants';

// Local search simulation to replace backend API dependency
export const searchAiTools = async (userQuery: string): Promise<AiTool[]> => {
  // Simulate network latency for a realistic feel
  await new Promise(resolve => setTimeout(resolve, 600));

  if (!userQuery.trim()) {
    return INITIAL_TOOLS;
  }

  const lowerQuery = userQuery.toLowerCase();
  
  // Perform local search against existing database
  const results = INITIAL_TOOLS.filter(tool => 
    tool.name.toLowerCase().includes(lowerQuery) || 
    tool.description.toLowerCase().includes(lowerQuery) ||
    tool.category.toLowerCase().includes(lowerQuery)
  );

  return results.length > 0 ? results : INITIAL_TOOLS;
};