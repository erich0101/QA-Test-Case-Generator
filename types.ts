
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