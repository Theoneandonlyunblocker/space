import Personality from "../Personality";
import Unit from "../Unit";

export interface AITemplate<SaveData>
{
  type: string;
  personality: Personality;

  processTurn(afterFinishedCallback: () => void): void;
  createBattleFormation(
    availableUnits: Unit[],
    hasScouted: boolean,
    enemyUnits?: Unit[],
    enemyFormation?: Unit[][],
  ): Unit[][];
  evaluateUnitStrength(...units: Unit[]): number;
  serialize(): SaveData;
}

export default AITemplate;
