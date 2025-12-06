import { GoogleGenAI, Type } from "@google/genai";
import { SolveMode } from '../types';

// Ensure API Key is present
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Solves a homework problem using Gemini.
 * Supports both text and image input.
 * Uses 'thinkingConfig' for deep reasoning if mode is DEEP.
 */
export const solveProblem = async (
  text: string, 
  imageBase64: string | null, 
  mode: SolveMode
): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  const modelName = mode === SolveMode.DEEP ? 'gemini-2.5-flash' : 'gemini-2.5-flash';
  
  // Prepare contents
  const parts: any[] = [];
  
  if (imageBase64) {
    // Extract base64 data (remove data:image/png;base64, prefix if present)
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg', // Assuming JPEG for simplicity, or detect from string
        data: base64Data
      }
    });
  }

  parts.push({ text: text || "Analyze this image and solve the problem step-by-step." });

  // Config setup
  const config: any = {
    systemInstruction: "You are an expert academic tutor. Provide clear, step-by-step solutions. If the input is a math problem, show the work. Use Markdown for formatting. If the user provides an image, carefully transcribe and solve it.",
  };

  // Enable thinking for deep mode (using 2.5 flash which supports thinkingConfig)
  if (mode === SolveMode.DEEP) {
    config.thinkingConfig = { thinkingBudget: 2048 }; 
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: config
    });
    
    return response.text || "I couldn't generate a solution. Please try again.";
  } catch (error) {
    console.error("Gemini Solve Error:", error);
    throw error;
  }
};

/**
 * Explores universities or topics using Google Search grounding.
 */
export const exploreTopic = async (query: string): Promise<{ text: string; sources: any[] }> => {
  if (!apiKey) throw new Error("API Key not found");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find detailed information about: ${query}. Focus on academic reputation, key programs, and student life if applicable.`,
      config: {
        tools: [{ googleSearch: {} }], // Enable Google Search
      }
    });

    const text = response.text || "No results found.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Extract sources if available
    const sources = chunks
      .map((chunk: any) => chunk.web ? { title: chunk.web.title, url: chunk.web.uri } : null)
      .filter((s: any) => s !== null);

    return { text, sources };
  } catch (error) {
    console.error("Gemini Explore Error:", error);
    throw error;
  }
};

/**
 * Generates a quick quiz for a subject.
 */
export const generateQuiz = async (subject: string): Promise<any> => {
    if (!apiKey) throw new Error("API Key not found");
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Create a short quiz with 3 multiple choice questions for the subject: ${subject}.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        options: { type: Type.ARRAY, items: { type: Type.STRING } },
                        answer: { type: Type.STRING, description: "The correct option text" }
                    }
                }
            }
        }
      });
  
      return JSON.parse(response.text || "[]");
    } catch (error) {
      console.error("Gemini Quiz Error:", error);
      return [];
    }
  };