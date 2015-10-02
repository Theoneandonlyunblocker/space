declare module Rance
{
  module Templates
  {
    interface ITechnologyTemplate
    {
      key: string;
      displayName: string;
      description: string;

      maxLevel: number;

      // set dynamically
      unlocksPerLevel?:
      {
        [level: number]: Array<IUnitTemplate | IItemTemplate>;
      }
    }
  }
}
