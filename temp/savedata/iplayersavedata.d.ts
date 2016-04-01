/// <reference path="idiplomacystatussavedata.d.ts" />
/// <reference path="iplayertechnologysavedata.d.ts" />

interface IPlayerSaveData
{
  id: number;
  name: string;
  color: number;
  colorAlpha: number;
  secondaryColor: number;
  isIndependent: boolean;
  isAI: boolean;
  resources:
  {
    [resourceType: string]: number;
  };
  diplomacyStatus: IDiplomacyStatusSaveData;

  flag?: IFlagSaveData;
  personality?: IPersonality;

  unitIds: number[];
  fleets: IFleetSaveData[];
  money: number;
  controlledLocationIds: number[];
  items: IItemSaveData[];
  revealedStarIds: number[];
  identifiedUnitIds: number[];
  researchByTechnology?: IPlayerTechnologySaveData;
}
