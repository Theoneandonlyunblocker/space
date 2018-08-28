import {UnlockableThing} from "./UnlockableThing";

declare interface TechnologyTemplate
{
  key: string;
  displayName: string;
  description: string;

  maxLevel: number;
}

export default TechnologyTemplate;
