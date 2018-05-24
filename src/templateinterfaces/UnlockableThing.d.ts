import TechnologyRequirement from "./TechnologyRequirement";


export type UnlockableThingKind = "unit" | "item";

export interface UnlockableThing
{
  type: string;
  displayName: string;
  description: string;

  kind: UnlockableThingKind;

  // set dynamically from technology templates
  technologyRequirements?: TechnologyRequirement[];
}
