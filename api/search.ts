import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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
    console.error("GEMINI_API_KEY is missing.");
    return res.status(500).json({ error: "Server configuration error: API Key missing" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
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
      contents: `User search query: "${q}". 
      
      Generate a curated list of 5-8 highly relevant, real-world AI tools that match this query.
      If the query is vague, provide popular general AI tools.
      
      Requirements:
      - IDs must be unique strings.
      - Descriptions should be concise and benefit-focused.
      - URLs must be valid homepages.
      `,
      config: {
        systemInstruction: "You are an intelligent search engine for AI software.",
        responseMimeType: "application/json",
        responseSchema: toolSchema,
        temperature: 0.5, 
      },
    });

    const text = response.text;
    
    if (!text) {
      console.error("Gemini returned empty text.");
      return res.status(500).json({ error: "AI returned no content" });
    }

    // Clean Markdown formatting if present (e.g. ```json ... ```)
    const cleanedText = text.replace(/```json\n?|```/g, '').trim();

    let tools;
    try {
      tools = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Raw text:", text);
      return res.status(500).json({ error: "Failed to parse AI response" });
    }

    return res.status(200).json(tools);

  } catch (error: any) {
    console.error("Gemini API Error:", error.message, error.stack);
    return res.status(500).json({ error: "Internal AI Error", details: error.message });
  }
}