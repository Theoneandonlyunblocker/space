export interface ManufactorySaveData
{
  capacity: number;
  maxCapacity: number;
  buildQueue:
  {
    kind: string;
    templateType: string;
  }[];
}
