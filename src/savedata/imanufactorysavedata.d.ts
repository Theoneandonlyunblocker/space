declare module Rance
{
  interface IManufactorySaveData
  {
    capacity: number;
    maxCapacity: number;
    unitStatsModifier: number;
    unitHealthModifier: number;
    buildQueue:
    {
      type: string;
      templateType: string;
    }[]
  }
}
