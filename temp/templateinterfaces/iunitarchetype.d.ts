declare interface IUnitArchetype
{
  type: string;
  idealWeightInFleet: number; // relative to others
  idealWeightInBattle: number;
  rowScores:
  {
    ROW_FRONT: number;
    ROW_BACK: number;
  }; // TODO enum
  scoreMultiplierForRowFN?: (row: string, rowUnits: Unit[], enemyUnits: Unit[]) => number;
}
