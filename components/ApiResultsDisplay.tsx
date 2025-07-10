
import React, { useState } from 'react';
import { ApiScenarioResult } from '../types';
import ApiScenarioCard from './ApiScenarioCard';
import { DownloadIcon } from './icons/DownloadIcon';

interface ApiResultsDisplayProps {
  scenarios: ApiScenarioResult[];
  onClear: () => void;
  curlInput: string;
}

/**
 * Detects the intended body type from the original cURL command.
 * The cURL command is the source of truth, not the AI's response.
 * @param {string} curl The original cURL command string.
 * @returns {'formdata' | 'raw'} The detected body type.
 */
const detectCurlBodyType = (curl: string): 'formdata' | 'raw' => {
  // Regex to find --form or -F as a standalone flag
  const formDataRegex = /(^|\s)(-F|--form)\s/;
  return formDataRegex.test(curl) ? 'formdata' : 'raw';
};


/**
 * Parses a URL string into a Postman URL object structure.
 * This is a simplified parser that is robust enough for URLs containing
 * Postman-style variables like {{url_base}}.
 * @param {string} urlString The URL to parse.
 * @returns {object} A Postman URL object.
 */
const buildPostmanUrlObject = (urlString: string) => {
  const postmanUrl: any = {
    raw: urlString,
  };

  if (!urlString) {
    return postmanUrl;
  }
  
  let tempUrl = urlString;

  // Protocol
  const protocolMatch = tempUrl.match(/^(https?):\/\//);
  if (protocolMatch) {
    postmanUrl.protocol = protocolMatch[1];
    tempUrl = tempUrl.substring(protocolMatch[0].length);
  }

  // Query
  const querySplit = tempUrl.split('?');
  const hostAndPath = querySplit[0];
  const queryString = querySplit[1];

  if (queryString !== undefined) {
    postmanUrl.query = queryString.split('&').filter(p => p).map(param => {
      const kv = param.split('=');
      const key = kv[0] || '';
      const value = kv[1] !== undefined ? decodeURIComponent(kv[1] || '') : null;
      return { key, value };
    });
  }

  // Host and Path
  const pathSegments = hostAndPath.split('/');
  const hostPart = pathSegments.shift() || '';
  
  if (hostPart) {
     postmanUrl.host = [hostPart];
  }
  
  // pathSegments now contains only the path parts.
  // A trailing slash results in an empty string at the end of pathSegments.
  if (pathSegments.length > 0) {
     postmanUrl.path = pathSegments;
  }
  
  return postmanUrl;
};

/**
 * Builds the Postman body object based on the DETECTED mode from the cURL command.
 * This function relies on the `detectedMode` parameter, which is derived from the
 * user's original cURL input, making it robust against AI response inconsistencies.
 * @param {'formdata' | 'raw'} detectedMode - The mode detected from the original cURL.
 * @param {Record<string, any> | string | undefined} body - The request body content from the AI.
 * @returns {object | undefined} The Postman body object.
 */
const buildPostmanBody = (
  detectedMode: 'formdata' | 'raw',
  body: Record<string, any> | string | undefined
) => {
  if (!body || (typeof body === 'object' && Object.keys(body).length === 0)) {
    return undefined;
  }

  if (detectedMode === 'formdata') {
    let bodyObject: Record<string, any> | null = null;
    if (typeof body === 'object' && !Array.isArray(body)) {
      bodyObject = body;
    } else if (typeof body === 'string') {
      try {
        // AI might return a stringified JSON object. Attempt to parse it.
        const parsed = JSON.parse(body);
        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
          bodyObject = parsed;
        }
      } catch (e) {
        console.warn("Could not parse body string as JSON for multipart/form-data:", body);
      }
    }

    if (bodyObject) {
      return {
        mode: 'formdata',
        formdata: Object.entries(bodyObject).map(([key, value]) => ({
          key,
          value: String(value),
          type: 'text'
        }))
      };
    }
    return undefined;
  }

  // Default to 'raw' for all other cases
  const rawBody = typeof body === 'string' ? body : JSON.stringify(body, null, 2);
  const language = (rawBody.trim().startsWith('{') || rawBody.trim().startsWith('[')) ? 'json' : 'text';

  return {
    mode: 'raw',
    raw: rawBody,
    options: {
      raw: {
        language
      }
    }
  };
};


const ApiResultsDisplay: React.FC<ApiResultsDisplayProps> = ({ scenarios, onClear, curlInput }) => {
  const [isExporting, setIsExporting] = useState(false);

  if (scenarios.length === 0) {
    return null;
  }
  
  const handleExportPostmanCollection = () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const detectedBodyType = detectCurlBodyType(curlInput);

      // 1. Aggregate all unique variables and suggestions, and build a master description.
      const allEnvVars = new Set<string>();
      const allSuggestions = new Set<string>();
      let masterDescription = "# Colección de Pruebas de API Generada\n\nEsta colección fue generada automáticamente por el Asistente de Pruebas de QA.\n\n";
      
      const scenarioSummaries: string[] = [];

      scenarios.forEach(scenario => {
        (scenario.envVars || []).forEach(v => allEnvVars.add(v));
        (scenario.suggestions || []).forEach(s => allSuggestions.add(s));
        scenarioSummaries.push(`### ${scenario.title}\n${scenario.description}\n\n**Gherkin:**\n\`\`\`gherkin\n${scenario.gherkin}\n\`\`\`\n`);
      });

      if (allEnvVars.size > 0) {
          masterDescription += "## Variables de Entorno Requeridas\n\nLas siguientes variables deben ser configuradas en tu entorno de Postman para el correcto funcionamiento de la colección:\n\n";
          masterDescription += Array.from(allEnvVars).map(v => `- \`${v}\``).join('\n');
          masterDescription += "\n\n";
      }

      if (allSuggestions.size > 0) {
          masterDescription += "## Sugerencias Generales\n\n";
          masterDescription += Array.from(allSuggestions).map(s => `- ${s}`).join('\n');
          masterDescription += "\n\n";
      }

      masterDescription += "--- \n## Resumen de Escenarios\n\n" + scenarioSummaries.join('---\n');


      // 2. Build the request items for the collection.
      const items = scenarios.map(scenario => {
        return {
          name: scenario.title,
          description: {
              content: `**Descripción:** ${scenario.description}\n\n**Gherkin:**\n\`\`\`gherkin\n${scenario.gherkin}\n\`\`\``,
              type: 'text/markdown'
          },
          event: [
            {
              listen: 'prerequest',
              script: {
                exec: (scenario.preRequestScript || '').split('\n'),
                type: 'text/javascript'
              }
            },
            {
              listen: 'test',
              script: {
                exec: (scenario.testScript || '').split('\n'),
                type: 'text/javascript'
              }
            }
          ],
          request: {
            method: scenario.method,
            header: Object.entries(scenario.headers || {}).map(([key, value]) => ({ key, value, type: 'text' })),
            body: buildPostmanBody(detectedBodyType, scenario.body),
            url: buildPostmanUrlObject(scenario.url),
          },
          response: []
        };
      });

      // 3. Build the final collection object.
      const collection = {
        info: {
          _postman_id: `generated-${Date.now()}`,
          name: 'QA Generated API Collection',
          description: {
            content: masterDescription,
            type: 'text/markdown'
          },
          schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
        },
        item: items,
        variable: Array.from(allEnvVars).map(key => ({
            key: key.replace(/{{|}}/g, ''), // Remove mustaches for variable definition
            value: '', // User needs to fill this
            type: 'default'
        }))
      };

      // 4. Create and trigger download.
      const collectionJson = JSON.stringify(collection, null, 2);
      const blob = new Blob([collectionJson], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'QA_Postman_Collection.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Failed to export Postman collection:", error);
    } finally {
      setIsExporting(false);
    }
  };


  return (
    <div className="mt-8 space-y-6">
      <div className="flex justify-between items-center border-b-2 border-slate-700 pb-2">
        <h2 className="text-2xl font-bold text-slate-200">
          Escenarios de API Generados ({scenarios.length})
        </h2>
        <div className="flex items-center gap-2">
           <button
            onClick={handleExportPostmanCollection}
            disabled={isExporting}
            className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-emerald-300 bg-emerald-900/50 border border-brand-secondary rounded-lg hover:bg-emerald-800/70 disabled:opacity-50 disabled:cursor-wait transition-colors duration-200"
            aria-label="Descargar Colección de Postman"
          >
            <DownloadIcon className="w-4 h-4" />
            <span>{isExporting ? 'Exportando...' : 'Descargar Colección'}</span>
          </button>
          <button
            onClick={onClear}
            className="px-4 py-2 text-sm font-semibold text-rose-300 bg-rose-900/50 border border-brand-danger rounded-lg hover:bg-rose-800/70 transition-colors duration-200"
            aria-label="Borra todos los escenarios"
          >
            Clear All
          </button>
        </div>
      </div>

      {scenarios.map((scenario) => (
        <ApiScenarioCard 
          key={scenario.id} 
          scenario={scenario} 
        />
      ))}
    </div>
  );
};

export default ApiResultsDisplay;
