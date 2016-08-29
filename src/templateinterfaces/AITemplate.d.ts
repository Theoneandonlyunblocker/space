import Personality from "../Personality";

export interface AITemplate<SaveData>
{
  type: string;
  personality: Personality;
  
  processTurn(afterFinishedCallback: () => void): void;
  serialize(): SaveData;
}

export default AITemplate;
