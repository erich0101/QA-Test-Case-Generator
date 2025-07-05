import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT, API_CURL_TEST_PROMPT } from '../constants';
import { RawScenario, ImageAttachment, ApiScenario } from '../types';

type Mode = 'e2e' | 'api';

export async function generateScenarios(
  mode: Mode,
  promptText: string,
  apiKey: string,
  images: ImageAttachment[] = []
): Promise<RawScenario[] | ApiScenario[]> {
  if (!apiKey) {
    throw new Error("API Key is required. Please add your Gemini API key to proceed.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = mode === 'e2e' ? SYSTEM_PROMPT : API_CURL_TEST_PROMPT;
  const contents: any[] = [];
  let taskPrompt = '';

  if (mode === 'e2e') {
    taskPrompt = `
      **TAREA:**
      Analiza la siguiente historia de usuario/documento funcional y/o imagen(es) y genera una lista COMPLETA de escenarios de prueba.
      
      **HISTORIA DE USUARIO / DOCUMENTO FUNCIONAL A ANALIZAR:**
      \`\`\`
      ${promptText || '(No hay texto, basarse principalmente en la(s) imagen(es) adjunta(s) si existe(n))'}
      \`\`\`
    `;
    contents.push({ text: taskPrompt });

    if (images.length > 0) {
      images.forEach(image => {
          contents.push({
          inlineData: {
              mimeType: image.mimeType,
              data: image.data,
          },
          });
      });
    }
  } else { // mode === 'api'
      taskPrompt = `
      **TAREA:**
      Analiza el siguiente comando cURL y genera los escenarios de prueba para Postman.
      
      **COMANDO cURL A ANALIZAR:**
      \`\`\`
      ${promptText}
      \`\`\`
    `;
    contents.push({ text: taskPrompt });
  }


  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: { parts: contents },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    let jsonStr = response.text;

    if (!jsonStr) {
      throw new Error('La respuesta de la API estaba vacía.');
    }

    // Nueva lógica para extraer solo el JSON entre [ y ]
    const arrayRegex = /^[^[]*\[([\s\S]*?)\][^]]*$/;
    const arrayMatch = jsonStr.match(arrayRegex);
    if (arrayMatch && arrayMatch[1] !== undefined) {
      jsonStr = `[${arrayMatch[1].trim()}]`;
    } else {
      // Si no se encuentra un array, intentamos con la regex original de cerca
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }
    }

    const parsedData = JSON.parse(jsonStr);

    if (!Array.isArray(parsedData)) {
      throw new Error('La respuesta de la API no es un array JSON.');
    }

    // El tipo de retorno real se valida mediante guardias de tipo en App.tsx
    return parsedData as any;

  } catch (error) {
    console.error("Error llamando a la API de Gemini:", error);
    if (error instanceof Error) {
      throw new Error(`Fallo al generar escenarios: ${error.message}`);
    }
    throw new Error("Ocurrió un error desconocido al comunicarse con la API.");
  }
}
