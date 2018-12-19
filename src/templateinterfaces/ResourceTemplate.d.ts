import {DistributionData} from "./DistributionData";

declare interface ResourceTemplate
{
  type: string;
  displayName: string;
  // TODO 2018.12.20 | return element instead
  getIconSrc: () => string;

  distributionData: DistributionData;
}

export default ResourceTemplate;
