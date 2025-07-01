
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
