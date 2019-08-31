import {Unit} from "../unit/Unit";

export interface UnitArchetype
{
  type: string;
  idealWeightInFleet: number; // relative to others
  idealWeightInBattle: number;

  // one of these two must be defined
  rowScores?:
  {
    ROW_FRONT: number;
    ROW_BACK: number;
  }; // TODO enum
  scoreMultiplierForRowFN?: (row: string, rowUnits: Unit[], enemyUnits?: Unit[], enemyFormation?: Unit[][]) => number;
}
