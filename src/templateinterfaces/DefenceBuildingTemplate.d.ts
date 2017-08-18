import BuildingTemplate from "./BuildingTemplate";

// TODO 2017.08.18 | just have these add a passive effect
declare interface DefenceBuildingTemplate extends BuildingTemplate
{
  defenderAdvantage: number;
}

export default DefenceBuildingTemplate;
