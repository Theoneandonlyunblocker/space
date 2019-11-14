export interface ManufactorySaveData
{
  capacity: number;
  maxCapacity: number;
  unitStatsModifier: number;
  unitHealthModifier: number;
  buildQueue:
  {
    kind: string;
    templateType: string;
  }[];
}
