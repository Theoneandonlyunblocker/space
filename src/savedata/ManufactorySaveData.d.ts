declare interface ManufactorySaveData
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

export default ManufactorySaveData;
