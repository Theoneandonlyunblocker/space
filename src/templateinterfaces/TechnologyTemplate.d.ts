import ManufacturableThing from "./ManufacturableThing";

declare interface TechnologyTemplate
{
  key: string;
  displayName: string;
  description: string;

  maxLevel: number;

  unlocksPerLevel:
  {
    [level: number]: ManufacturableThing[];
  }
}

export default TechnologyTemplate;
