import {TechRequirement} from "./TechRequirement";


export interface UnlockableThing
{
  key: string;
  displayName: string;
  description: string;

  techRequirements?: TechRequirement[];
}
export interface UnlockableThingWithKind
{
  unlockableThing: UnlockableThing;
  unlockableThingKind: string;
}
