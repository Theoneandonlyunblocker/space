import {DistributionData} from "./DistributionData";

export interface ResourceTemplate
{
  type: string;
  displayName: string;
  getIcon: () => HTMLElement | SVGElement;

  distributionData: DistributionData;
}
