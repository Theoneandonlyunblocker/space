import RandomGenUnitRarity from "../RandomGenUnitRarity.ts";

declare interface PortraitTemplate
{
  // TODO portraits
  key: string;
  imageSrc: string;
  generatedFor: RandomGenUnitRarity[];
}

export default PortraitTemplate;
