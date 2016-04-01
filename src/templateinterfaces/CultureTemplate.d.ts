import Unit from "../Unit.ts";
import NameTemplate from "./NameTemplate.d.ts";
import PortraitTemplate from "./PortraitTemplate.d.ts";

declare interface CultureTemplate
{
  key: string;
  nameGenerator?: (unit: Unit) => string;

  firstNames?:
  {
    [key: string]: NameTemplate;
  };
  middleNames?:
  {
    [key: string]: NameTemplate;
  };
  lastNames?:
  {
    [key: string]: NameTemplate;
  };
  
  portraits?:
  {
    [key: string]: PortraitTemplate;
  };
}

export default CultureTemplate;
