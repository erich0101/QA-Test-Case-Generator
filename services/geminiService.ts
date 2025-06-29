import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';
import { RawScenario } from '../types';

// 1. Lee la variable de entorno usando el método estándar de Vite.
//    Esto funciona TANTO en local (con .env) COMO en Vercel (con Environment Variables).
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// 2. Comprueba si la clave existe. Si no, lanza un error claro.
if (!apiKey) {
  throw new Error(
    "Configuración de API Key faltante. Asegúrate de que VITE_GEMINI_API_KEY esté definida en tu archivo .env (para local) o en las Environment Variables de Vercel (para producción)."
  );
}

// 3. Inicializa la IA pasándole la clave directamente. Se hace UNA SOLA VEZ.
const ai = new GoogleGenAI(apiKey);

export async function generateTestScenarios(userStory: string): Promise<RawScenario[]> {
  // NO hay ninguna lógica de placeholders aquí. No es necesaria.
  // NO se vuelve a declarar `ai`. Ya existe.

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
    // 3. Usa el método correcto y actual del SDK para obtener el modelo.
    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash-lite-preview-06-17' });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });
    
    const response = result.response;
    const jsonStr = response.text();
    
    if (!jsonStr) {
      throw new Error('La respuesta de la API estaba vacía.');
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
