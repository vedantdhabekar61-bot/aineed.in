import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  // CORS setup for Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

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
    
    // Schema for structured JSON output
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
      contents: `User Search: "${q}". 
      
      Task: Return a JSON list of 5-8 highly relevant, real-world AI tools.
      
      Guidelines:
      1. If the query is specific (e.g., "video editing"), find tools for that niche.
      2. If the query is broad, return top-tier general tools.
      3. Descriptions should be benefit-driven and under 120 chars.
      4. Ensure URLs are real homepages.
      `,
      config: {
        systemInstruction: "You are an expert AI software directory.",
        responseMimeType: "application/json",
        responseSchema: toolSchema,
        temperature: 0.6,
      },
    });

    const text = response.text;
    
    if (!text) {
      throw new Error("Empty response from AI");
    }

    // Sanitize response just in case
    const cleanedText = text.replace(/```json\n?|```/g, '').trim();
    const tools = JSON.parse(cleanedText);

    return res.status(200).json(tools);

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: "Failed to generate recommendations", details: error.message });
  }
}