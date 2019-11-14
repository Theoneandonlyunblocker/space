import {TechRequirement} from "./TechRequirement";


export interface UnlockableThing
{
  type: string;
  displayName: string;
  description: string;

  techRequirements?: TechRequirement[];
}
export interface UnlockableThingWithKind
{
  unlockableThing: UnlockableThing;
  unlockableThingKind: string;
}
