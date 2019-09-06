import {BuildingFamily} from "core/templateinterfaces/BuildingFamily";


export const territoryBuildings: BuildingFamily =
{
  type: "territoryBuilding",

  maxBuiltAtLocation: 4,
};

export const sectorCommandFamily: BuildingFamily =
{
  type: "sectorCommandFamily",

  maxBuiltAtLocation: 1,
};
