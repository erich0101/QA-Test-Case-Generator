import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';
import { RawScenario } from '../types';

export async function generateTestScenarios(userStory: string, apiKey: string): Promise<RawScenario[]> {
  if (!apiKey) {
    throw new Error("API Key is required. Please add your Gemini API key to proceed.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // The `contents` field now contains the specific task, including the format instructions
  // and the user's input.
  const taskPrompt = `
    **TAREA:**
    Analiza la siguiente historia de usuario/documento funcional y genera una lista COMPLETA de escenarios de prueba.
    
    **HISTORIA DE USUARIO / DOCUMENTO FUNCIONAL A ANALIZAR:**
    \`\`\`
    ${userStory}
    \`\`\`
  `;

 try {
    // The call is refactored to use `systemInstruction` for the main persona prompt
    // and `contents` for the user-specific task. This is the modern, correct
    // way to structure the call and avoids the header encoding error.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-preview-06-17',
      contents: taskPrompt, // The specific task
      config: {
        systemInstruction: SYSTEM_PROMPT, // The overall persona and rules
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    let jsonStr = response.text;

    if (!jsonStr) {
      throw new Error('La respuesta de la API estaba vacía.');
    }

    // Clean up potential markdown code fences
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    const parsedData = JSON.parse(jsonStr);

    if (!Array.isArray(parsedData)) {
      throw new Error('La respuesta de la API no es un array JSON.');
    }

    return parsedData as RawScenario[];

  } catch (error) {
    console.error("Error llamando a la API de Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Fallo al generar escenarios de prueba: ${error.message}`);
    }
    throw new Error("Ocurrió un error desconocido al comunicarse con la API.");
  }
}
