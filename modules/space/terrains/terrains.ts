import {TerrainTemplate} from "../../../src/templateinterfaces/TerrainTemplate";
import { localize } from "./localization/localize";


export const noneTerrain: TerrainTemplate =
{
  type: "noneTerrain",
  get displayName()
  {
    return localize("noneTerrain_displayName").toString();
  },
};

export const asteroidsTerrain: TerrainTemplate =
{
  type: "asteroidsTerrain",
  get displayName()
  {
    return localize("asteroidsTerrain_displayName").toString();
  },
};
