declare namespace Rance
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
