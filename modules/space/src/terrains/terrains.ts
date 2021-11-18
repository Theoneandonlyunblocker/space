import {TerrainTemplate} from "core/src/templateinterfaces/TerrainTemplate";
import { localize } from "modules/space/localization/localize";


export const noneTerrain: TerrainTemplate =
{
  key: "noneTerrain",
  get displayName()
  {
    return localize("noneTerrain_displayName").toString();
  },
};

export const asteroidsTerrain: TerrainTemplate =
{
  key: "asteroidsTerrain",
  get displayName()
  {
    return localize("asteroidsTerrain_displayName").toString();
  },
};

export const terrainTemplates =
{
  noneTerrain: noneTerrain,
  asteroidsTerrain: asteroidsTerrain,
};
