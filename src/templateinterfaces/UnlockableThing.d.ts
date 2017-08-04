import TechnologyRequirement from "./TechnologyRequirement";


type UnlockType = "unit" | "item";

export interface UnlockableThing
{
  type: string;
  displayName: string;
  description: string;

  unlockType: UnlockType;

  // set dynamically from technology templates
  technologyRequirements?: TechnologyRequirement[];
}
