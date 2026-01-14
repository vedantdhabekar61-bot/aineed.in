import { GoogleGenAI, Type } from "@google/genai";
import { AiTool } from '../types';
import { INITIAL_TOOLS } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchAiTools = async (userQuery: string): Promise<AiTool[]> => {
  if (!userQuery.trim()) {
    return INITIAL_TOOLS;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user has the following problem or request: "${userQuery}". 
      Recommend 4 to 8 existing, real-world AI tools that best solve this problem. 
      Focus on popular, reliable, and high-quality tools.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Name of the AI tool" },
              description: { type: Type.STRING, description: "A short, punchy 1-2 sentence description of how it helps the user." },
              category: { type: Type.STRING, description: "The general category (e.g., Video, Coding, Writing)" },
              url: { type: Type.STRING, description: "The main website URL of the tool" },
            },
            required: ["name", "description", "category", "url"],
          },
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Empty response from Gemini");
    }

    // Safely parse and cast the response
    const rawTools = JSON.parse(jsonText) as Omit<AiTool, 'id'>[];
    
    // Add unique IDs to the tools
    const toolsWithIds: AiTool[] = rawTools.map((tool, index) => ({
      ...tool,
      id: `gen-${Date.now()}-${index}`,
    }));

    return toolsWithIds;

  } catch (error) {
    console.error("Search Service Error:", error);
    return INITIAL_TOOLS;
  }
};