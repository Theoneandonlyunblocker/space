import ItemTemplate from "./ItemTemplate";
import UnitTemplate from "./UnitTemplate";

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
