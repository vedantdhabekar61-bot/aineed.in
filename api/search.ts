import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. Setup CORS (allows your frontend to talk to this backend)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 2. Get the search query from the request
  const { query } = req.query || req.body;

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    // 3. Initialize Gemini
    // MAKE SURE to set GEMINI_API_KEY in your Vercel Environment Variables
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4. Create a prompt for Gemini
    // We ask it to return a JSON list of AI tools based on the user's search
    const prompt = `You are an expert AI finder. The user is searching for: "${query}".
    List 5 best AI tools relevant to this search.
    Return the response ONLY in valid JSON format like this:
    [
      { "name": "Tool Name", "description": "Short description", "link": "https://..." }
    ]
    Do not add markdown formatting like \`\`\`json. Just the raw JSON array.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 5. Clean up the response and send it back to frontend
    // Sometimes Gemini adds markdown code blocks, we strip them just in case
    const cleanedJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return res.status(200).json(JSON.parse(cleanedJson));

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: "Failed to fetch results from Gemini" });
  }
}
