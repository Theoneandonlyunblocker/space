export declare interface DistributionData
{
  /**
   * relative probability distributable is picked from pool of available distributables
   */
  rarity: number;
  /**
   * distributor function can filter available distributables based on these
   */
  distributionGroups: string[];
}
