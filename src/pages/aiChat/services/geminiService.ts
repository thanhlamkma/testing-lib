import { GoogleGenAI } from '@google/genai';

export const geminiService = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_AI_KEY });
