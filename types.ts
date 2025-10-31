export interface RawScenario {
  title: string;
  gherkin: string;
  acceptanceCriteria: string[];
  expectedResult?: string;
  assumption?: string;
  preconditions?: string[];
  testData?: string[];
}

export interface ScenarioResult {
  id: string;
  title:string;
  gherkin: string;
  criteria: string[];
  expectedResult?: string;
  assumption?: string;
  preconditions?: string[];
  testData?: string[];
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

export interface E2EHistoryItem {
  id: string;
  timestamp: number;
  userInput: string;
  images: ImageAttachment[];
  scenarios: ScenarioResult[];
  analysisResult?: string;
  optimizedStory?: string;
}

export interface ApiHistoryItem {
  id: string;
  timestamp: number;
  curlInput: string;
  scenarios: ApiScenarioResult[];
}