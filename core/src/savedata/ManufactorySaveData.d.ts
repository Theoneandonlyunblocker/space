export interface ManufactorySaveData
{
  capacity: number;
  maxCapacity: number;
  buildQueue:
  {
    kind: string;
    data: any;
  }[];
}
