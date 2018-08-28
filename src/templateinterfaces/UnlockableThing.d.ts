import TechRequirement from "./TechRequirement";


export type UnlockableThingKind = "unit" | "item";

export interface UnlockableThing
{
  type: string;
  displayName: string;
  description: string;

  kind: UnlockableThingKind;

  techRequirements?: TechRequirement[];
}
