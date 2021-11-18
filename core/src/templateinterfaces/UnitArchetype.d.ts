import {Unit} from "../unit/Unit";

type UnitArchetypeBase =
{
  key: string;
  idealWeightInFleet: number; // relative to others
  idealWeightInBattle: number;
}

type SimpleScores =
{
  rowScores:
  {
    ROW_FRONT: number;
    ROW_BACK: number;
  };
}
type ScoringFN =
{
  scoreMultiplierForRowFN: (row: string, rowUnits: Unit[], enemyUnits?: Unit[], enemyFormation?: Unit[][]) => number;
}

export type UnitArchetype = UnitArchetypeBase & (SimpleScores | ScoringFN);
