import RandomGenUnitRarity from "../RandomGenUnitRarity";

declare interface PortraitTemplate
{
  key: string;
  imageSrc: string;
  generatedFor: RandomGenUnitRarity[];
}

export default PortraitTemplate;
