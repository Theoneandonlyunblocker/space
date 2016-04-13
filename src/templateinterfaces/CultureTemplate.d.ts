import Unit from "../Unit";
import NameTemplate from "./NameTemplate";
import PortraitTemplate from "./PortraitTemplate";

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
