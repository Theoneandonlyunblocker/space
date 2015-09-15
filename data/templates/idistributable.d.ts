declare module Rance
{
  module Templates
  {
    interface IDistributable
    {
      type: string;
      // relative probability resource is picked from pool of available resources
      rarity: number;
      // sector needs to have any of these flags to possibly spawn resource there
      distributionGroups: string[];
    }
  }
}
