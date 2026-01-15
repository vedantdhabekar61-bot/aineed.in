import { GoogleGenAI, Type } from "@google/genai";

// Vercel Serverless Function Handler
export default async function handler(req: any, res: any) {
  // Allow simple CORS for development/production flexibility
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing in environment variables.");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Define the expected JSON structure for the AI response
    const toolSchema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          category: { type: Type.STRING },
          url: { type: Type.STRING },
        }
      }
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user is searching for: "${q}". 
      
      Return a list of 5 to 8 REAL, existing AI tools that perfectly match this request. 
      For each tool, provide:
      1. A unique string ID.
      2. The correct name.
      3. A short, punchy description (max 120 chars).
      4. A relevant category (e.g., 'Copywriting', 'Video Gen', 'Coding').
      5. The actual homepage URL.
      
      Ensure the tools are popular and reliable.`,
      config: {
        systemInstruction: "You are an expert AI tool finder.",
        responseMimeType: "application/json",
        responseSchema: toolSchema,
        temperature: 0.7,
      },
    });

    // Handle the response
    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI");
    }

    const tools = JSON.parse(text);
    return res.status(200).json(tools);

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: "Failed to fetch AI recommendations" });
  }
}