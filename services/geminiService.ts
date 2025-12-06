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
        mimeType: 'image/jpeg', // Assuming JPEG/PNG for simplicity
        data: base64Data
      }
    });
  }

  const promptText = text || "Analyze this image and solve the problem step-by-step.";
  parts.push({ text: promptText });

  // Config setup
  const config: any = {
    systemInstruction: "You are 'UniMind', a world-class academic tutor. Your goal is to explain complex math, science, and literature problems clearly. Use Markdown for formatting. \n- Use **bold** for key terms and final answers.\n- Use code blocks ``` for programming or complex equations.\n- Break down math problems into: 1. Analysis, 2. Step-by-Step Calculation, 3. Final Answer.\n- Be encouraging and concise.",
    temperature: 0.7,
  };

  // Enable thinking for deep mode (using 2.5 flash which supports thinkingConfig)
  if (mode === SolveMode.DEEP) {
    config.thinkingConfig = { thinkingBudget: 4096 }; // Higher budget for better reasoning
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
    return "I encountered an error connecting to the AI. Please check your internet connection or try again later.";
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
      contents: `Find detailed, up-to-date information about: ${query}. Focus on academic reputation, admission requirements, key programs, and student life. Format with **bold** headers.`,
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

    // Remove duplicates based on URL
    const uniqueSources = Array.from(new Map(sources.map((item:any) => [item['url'], item])).values());

    return { text, sources: uniqueSources };
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
        contents: `Create a challenging but fair quiz with 5 multiple choice questions for the subject: ${subject}.`,
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