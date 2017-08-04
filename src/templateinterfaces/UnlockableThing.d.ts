import TechnologyRequirement from "./TechnologyRequirement";


type UnlockType = "unit" | "item";

export interface UnlockableThing
{
  displayName: string;

  // set dynamically from technology templates
  technologyRequirements?: TechnologyRequirement[];
}
