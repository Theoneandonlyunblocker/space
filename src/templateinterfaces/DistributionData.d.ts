export declare interface DistributionData
{
  /**
   * relative probability distributable is picked from pool of available distributables
   */
  rarity: number;
  /**
   * distributor function will check these when choosing distributables
   */
  distributionGroups: string[];
}
