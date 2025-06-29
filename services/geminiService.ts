import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';
import { RawScenario } from '../types';
import { localApiKey } from './localApiKey';

const localApiKeyPlaceholder = "PASTE_YOUR_GEMINI_API_KEY_HERE";
// Vercel's build command (`sed`) will replace this placeholder with the actual key from environment variables.
const prodApiKeyPlaceholder = import.meta.env.VITE_GEMINI_API_KEY;;

let apiKey: string = prodApiKeyPlaceholder; // Default to the placeholder

// For local development, if the user has provided a key in `localApiKey.ts`, use it.
if (localApiKey && localApiKey !== localApiKeyPlaceholder) {
  apiKey = localApiKey;
}

export async function generateTestScenarios(userStory: string): Promise<RawScenario[]> {
  // If the API key is still the placeholder, it means it's not configured for local dev,
  // or the production build script failed to replace it.
  if (apiKey === prodApiKeyPlaceholder) {
    throw new Error("API key not configured. For local development, add your key to 'services/localApiKey.ts'. For production, ensure the API_KEY environment variable is set in Vercel and the build command is correct.");
  }

  // Correct initialization as per Google GenAI SDK guidelines
  const ai = new GoogleGenAI({ apiKey });

  const fullPrompt = `
    ${SYSTEM_PROMPT}

    ---
    **TAREA:**
    Analiza la siguiente historia de usuario/documento funcional y genera una lista COMPLETA de escenarios de prueba.

    **FORMATO DE SALIDA OBLIGATORIO:**
    Responde EXCLUSIVAMENTE con un único array JSON válido.
    \`\`\`json
    [
      {
        "title": "string",
        "gherkin": "string",
        "acceptanceCriteria": ["string"]
      }
    ]
    \`\`\`

    **HISTORIA DE USUARIO / DOCUMENTO FUNCIONAL A ANALIZAR:**
    \`\`\`
    ${userStory}
    \`\`\`
  `;

 try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-preview-06-17',
      contents: fullPrompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    // Directly use response.text which is the recommended way.
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
