
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';
import { RawScenario, ImageAttachment } from '../types';

export async function generateTestScenarios(
  userStory: string,
  apiKey: string,
  images: ImageAttachment[]
): Promise<RawScenario[]> {
  if (!apiKey) {
    throw new Error("API Key is required. Please add your Gemini API key to proceed.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const taskPrompt = `
    **TAREA:**
    Analiza la siguiente historia de usuario/documento funcional y/o imagen(es) y genera una lista COMPLETA de escenarios de prueba.
    
    **HISTORIA DE USUARIO / DOCUMENTO FUNCIONAL A ANALIZAR:**
    \`\`\`
    ${userStory || '(No hay texto, basarse principalmente en la(s) imagen(es) adjunta(s) si existe(n))'}
    \`\`\`
  `;

  const contents = [];
  contents.push({ text: taskPrompt });

  if (images && images.length > 0) {
    images.forEach(image => {
        contents.push({
        inlineData: {
            mimeType: image.mimeType,
            data: image.data,
        },
        });
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: { parts: contents },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    let jsonStr = response.text;

    if (!jsonStr) {
      throw new Error('La respuesta de la API estaba vacía.');
    }

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
