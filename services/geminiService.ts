import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';
import { RawScenario } from '../types';
import { localApiKey } from './localApiKey';

// This placeholder will be replaced by the Vercel build command during deployment.
const deploymentApiKeyPlaceholder = "__GEMINI_API_KEY__";

// Use the local API key for development if it has been set.
// Otherwise, fall back to the deployment placeholder for the build process.
const apiKey = (localApiKey && localApiKey !== 'PASTE_YOUR_GEMINI_API_KEY_HERE') 
  ? localApiKey 
  : deploymentApiKeyPlaceholder;

// Initialize the GoogleGenAI instance.
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== deploymentApiKeyPlaceholder && apiKey !=='__GEMINI_API_KEY__') {
  ai = new GoogleGenAI({ apiKey });
} else {
  // This warning is expected during the Vercel build process before the key is replaced.
  console.warn("API Key placeholder is being used. This is normal for deployment builds. The key will be injected by the build command.");
}

export async function generateTestScenarios(userStory: string): Promise<RawScenario[]> {
  // Defensive check in case the key is replaced during a build process.
  if (!ai && apiKey && apiKey !== deploymentApiKeyPlaceholder) {
      ai = new GoogleGenAI({apiKey});
  }

  if (!ai) {
     throw new Error('API Key is not configured. For local development, add your key to `services/localApiKey.ts`. For deployment, ensure the `API_KEY` environment variable is set and injected during your Vercel build process.');
  }

  const fullPrompt = `
    ${SYSTEM_PROMPT}

    ---

    **TAREA:**
    Analiza la siguiente historia de usuario/documento funcional y genera una lista COMPLETA de escenarios de prueba según las reglas que te definen.

    **FORMATO DE SALIDA OBLIGATORIO:**
    Responde EXCLUSIVAMENTE con un único array JSON válido. No incluyas texto, explicaciones, ni la palabra "json" antes o después del array. La estructura del array debe ser:
    \`\`\`json
    [
      {
        "title": "string (título claro y concreto del escenario)",
        "gherkin": "string (escenario detallado en sintaxis Gherkin, incluyendo saltos de línea con \\n)",
        "acceptanceCriteria": [
          "string (criterio de aceptación 1)",
          "string (criterio de aceptación 2)"
        ]
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

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr);

    if (!Array.isArray(parsedData)) {
      throw new Error('API response is not a JSON array.');
    }

    return parsedData as RawScenario[];

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new Error('The configured API Key is not valid. Please check the value in your Vercel environment variables or your localApiKey.ts file.');
        }
        throw new Error(`Failed to generate test scenarios: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the API.");
  }
}
