declare module Rance
{
  module Templates
  {
    interface IResourceTemplate extends IDistributable
    {
      type: string;
      displayName: string;
      icon: string;
    }
  }
}
