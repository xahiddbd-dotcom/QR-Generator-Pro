
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const analyzeQRContent = async (content: string, lang: Language) => {
  const ai = getAI();
  const languageName = lang === 'bn' ? 'Bengali' : 'English';
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this QR code content: "${content}". 
    Is it a URL? A plain text? Contact info? 
    Is it potentially malicious? 
    Provide a detailed breakdown in ${languageName}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isSafe: { type: Type.BOOLEAN },
          summary: { type: Type.STRING },
          category: { type: Type.STRING },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["isSafe", "summary", "category", "suggestions"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return null;
  }
};

export const extractQRFromImage = async (base64Image: string, lang: Language) => {
  const ai = getAI();
  const languageName = lang === 'bn' ? 'Bengali' : 'English';
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: `Task: Identify and decode the QR code within this image. 
          Return a structured JSON in ${languageName} with keys: decodedContent (string), isSafe (boolean), summary (string), category (string), suggestions (array of strings).` }
      ]
    },
    config: { responseMimeType: "application/json" }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("QR extraction from image failed", e);
    return null;
  }
};

export const performVisualAnalysis = async (base64Image: string, lang: Language) => {
  const ai = getAI();
  const languageName = lang === 'bn' ? 'Bengali' : 'English';
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: `Act as a Google Lens alternative. Analyze this image and extract any QR codes, barcodes, text, or objects. 
          Return a structured JSON in ${languageName} with keys: objects (array), description (string), ocrText (string, optional), safetyRating (string).` }
      ]
    },
    config: { responseMimeType: "application/json" }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Visual analysis failed", e);
    return null;
  }
};

export const askAIAboutContent = async (content: string, question: string, lang: Language) => {
  const ai = getAI();
  const languageName = lang === 'bn' ? 'Bengali' : 'English';
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Context: "${content}". User Question: "${question}". 
    Answer in a friendly, helpful manner in ${languageName}.`,
  });

  return response.text;
};
