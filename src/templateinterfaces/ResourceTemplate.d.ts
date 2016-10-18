import {DistributionData} from "./DistributionData";

declare interface ResourceTemplate
{
  type: string;
  displayName: string;
  icon: string;

  distributionData: DistributionData;
}

export default ResourceTemplate;
