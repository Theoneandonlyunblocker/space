import {Distributable} from "./Distributable";
import {DistributionData} from "./DistributionData";

declare interface ResourceTemplate extends Distributable
{
  type: string;
  displayName: string;
  icon: string;

  distributionData: DistributionData;
}

export default ResourceTemplate;
