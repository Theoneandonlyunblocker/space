import {DistributionData} from "./DistributionData";

export interface ResourceTemplate
{
  type: string;
  displayName: string;
  getIcon: () => HTMLElement | SVGElement;
  styleTextProps?: (props: React.HTMLProps<HTMLSpanElement>) => void;

  // lower displayOrder = listed first
  // resources with same displayOrder sorted by displayName
  displayOrder: number;
  distributionData: DistributionData;
  baseValuableness: number;
}
