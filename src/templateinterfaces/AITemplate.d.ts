import Personality from "../Personality";
import Unit from "../Unit";

export interface AITemplate<SaveData>
{
  type: string;
  personality: Personality;

  processTurn(afterFinishedCallback: () => void): void;
  evaluateUnitStrength(...units: Unit[]): number;
  serialize(): SaveData;
}

export default AITemplate;
