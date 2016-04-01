import ItemTemplate from "./ItemTemplate.d.ts";
import UnitTemplate from "./UnitTemplate.d.ts";

declare interface TechnologyTemplate
{
  key: string;
  displayName: string;
  description: string;

  maxLevel: number;

  // set dynamically
  unlocksPerLevel?:
  {
    [level: number]: Array<UnitTemplate | ItemTemplate>;
  }
}

export default TechnologyTemplate;
