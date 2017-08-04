import {UnlockableThing} from "./UnlockableThing";

declare interface TechnologyTemplate
{
  key: string;
  displayName: string;
  description: string;

  maxLevel: number;

  // used to dynamically set unlockable thing tech requirements
  unlocksPerLevel:
  {
    [level: number]: UnlockableThing[];
  };
}

export default TechnologyTemplate;
