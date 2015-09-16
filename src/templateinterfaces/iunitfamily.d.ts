declare module Rance
{
  module Templates
  {
    interface IUnitFamily extends IDistributable
    {
      type: string;
      debugOnly: boolean;
      alwaysAvailable: boolean;
      
      associatedTemplates?: IUnitTemplate[]; //set dynamically
    }
  }
}
