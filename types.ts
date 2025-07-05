
export interface RawScenario {
  title: string;
  gherkin: string;
  acceptanceCriteria: string[];
}

export interface ScenarioResult {
  id: string;
  title:string;
  gherkin: string;
  criteria: string[];
}

export interface ImageAttachment {
  mimeType: string;
  data: string; // base64 encoded string
}

export interface ApiScenario {
  title: string;
  description: string;
  gherkin: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body: Record<string, any> | string;
  preRequestScript: string;
  testScript: string;
  envVars: string[];
  suggestions: string[];
}

export interface ApiScenarioResult extends ApiScenario {
  id: string;
}
