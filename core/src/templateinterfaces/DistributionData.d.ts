/**
 * used for map generation / anything else where things need to be randomly distributed
 */
export interface DistributionData
{
  /**
   * relative probability distributable is picked from pool of available distributables
   */
  weight: number;
  /**
   * distributor function can filter available distributables based on these
   */
  distributionGroups: string[];
}
