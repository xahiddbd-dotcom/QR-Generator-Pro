
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";
import { APP_CONFIG } from "../config";

export const analyzeQRContent = async (content: string, lang: Language) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  const languageName = lang === 'bn' ? 'Bengali' : 'English';
  const response = await ai.models.generateContent({
    model: APP_CONFIG.MODEL_NAME,
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  const languageName = lang === 'bn' ? 'Bengali' : 'English';
  
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };

  const textPart = {
    text: `Task: Identify and decode the QR code within this image. 
    1. Extract the raw text/URL/data from the QR code.
    2. Analyze if the link or data is safe.
    3. Determine the category (WiFi, Social Media, Website, etc.)
    Return a structured JSON in ${languageName} with keys: decodedContent (string), isSafe (boolean), summary (string), category (string), suggestions (array of strings).`
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [imagePart, textPart] },
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  const languageName = lang === 'bn' ? 'Bengali' : 'English';
  
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };

  const textPart = {
    text: `Act as a Google Lens alternative. Analyze this image and extract any QR codes, barcodes, text, or objects you see. 
    Return a structured JSON analysis in ${languageName} with keys: objects (array), description (string), ocrText (string, optional), safetyRating (string).`
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [imagePart, textPart] },
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  const languageName = lang === 'bn' ? 'Bengali' : 'English';
  const response = await ai.models.generateContent({
    model: APP_CONFIG.MODEL_NAME,
    contents: `The following content was extracted from a QR code/image: "${content}".
    User question: "${question}".
    Answer the user in a friendly way in ${languageName}.`,
  });

  return response.text;
};
