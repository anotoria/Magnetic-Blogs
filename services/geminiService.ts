import { GoogleGenAI, Type } from "@google/genai";
import { Language } from '../types';

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API Key not found");
    }
    return new GoogleGenAI({ apiKey });
};

export const generateBlogIdeas = async (topic: string, language: Language) => {
  const ai = getClient();
  
  const prompt = `
    You are an expert content strategist and SEO specialist.
    The user wants blog post ideas for the niche: "${topic}".
    Language: ${language}.
    
    Task:
    1. Analyze current high-traffic trends related to this niche.
    2. Generate 10 distinct, catchy, and SEO-optimized blog post titles.
    3. Provide a short, compelling description (meta description style) for each.
    
    The tone should be professional yet engaging.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["title", "description"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};
