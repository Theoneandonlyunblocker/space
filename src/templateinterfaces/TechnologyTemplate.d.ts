import {UnlockableThing} from "./UnlockableThing";

declare interface TechnologyTemplate
{
  key: string;
  displayName: string;
  description: string;

  maxLevel: number;

  // used to dynamically set tech requirements for unlockable things
  // TODO 2018.08.28 | maybe other way around?
  unlocksPerLevel:
  {
    [level: number]: UnlockableThing[];
  };
}

export default TechnologyTemplate;
