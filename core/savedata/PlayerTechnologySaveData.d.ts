export interface PlayerTechnologySaveData
{
  [technologyKey: string]:
  {
    totalResearch: number;
    priority: number;
    priorityIsLocked: boolean;
  };
}
