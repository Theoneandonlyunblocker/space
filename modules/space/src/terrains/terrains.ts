import {TerrainTemplate} from "core/src/templateinterfaces/TerrainTemplate";
import { localize } from "modules/space/localization/localize";


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
