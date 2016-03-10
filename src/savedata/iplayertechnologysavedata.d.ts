declare module Rance
{
  interface IPlayerTechnologySaveData
  {
    [technologyKey: string]:
    {
      totalResearch: number;
      priority: number;
      priorityIsLocked: boolean;
    }
  }
}
