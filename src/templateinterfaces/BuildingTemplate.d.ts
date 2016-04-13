import BuildingEffect from "./BuildingEffect";

declare interface BuildingTemplate
{
  type: string;
  category: string;
  displayName: string;
  description: string;
  
  iconSrc: string;
  buildCost: number;
  
  family?: string; // all buildings in same family count towards maxPerType
  maxPerType: number;

  effect?: BuildingEffect;
  // if not specified, upgradeLevel is used as multiplier instead
  effectMultiplierFN?: (upgradeLevel: number) => number;
  
  maxUpgradeLevel: number;
  upgradeOnly?: boolean;
  upgradeInto?:
  {
    templateType: string;
    level: number;
  }[];
}

export default BuildingTemplate;
