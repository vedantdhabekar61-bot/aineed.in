import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client with the secure server-side key
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Invalid query provided' });
  }

  if (!ai) {
    console.error("GEMINI_API_KEY is missing on the server.");
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user has the following problem or request: "${query}". 
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

    const rawTools = JSON.parse(jsonText);
    
    // Add unique IDs to the tools
    const toolsWithIds = rawTools.map((tool: any, index: number) => ({
      ...tool,
      id: `gen-${Date.now()}-${index}`,
    }));

    return res.status(200).json(toolsWithIds);

  } catch (error: any) {
    console.error("Gemini Search Error:", error);
    return res.status(500).json({ error: error.message || 'Failed to fetch AI recommendations' });
  }
}