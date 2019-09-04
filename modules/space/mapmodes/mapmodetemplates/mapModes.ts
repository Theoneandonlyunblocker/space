import {MapRendererMapModeTemplate} from "../../../../src/templateinterfaces/MapRendererMapModeTemplate";

import * as MapLayers from "../allMapLayerTemplates";
import { localize } from "../localization/localize";


export const defaultMapMode: MapRendererMapModeTemplate =
{
  key: "defaultMapMode",
  get displayName()
  {
    return localize("defaultMapMode_displayName").toString();
  },
  layers:
  [
    MapLayers.nonFillerVoronoiLines,
    MapLayers.starOwners,
    MapLayers.ownerBorders,
    MapLayers.starLinks,
    MapLayers.nonFillerStars,
    MapLayers.fogOfWar,
    MapLayers.fleets,
  ],
};
export const noStatic: MapRendererMapModeTemplate =
{
  key: "noStatic",
  get displayName()
  {
    return localize("noStatic_displayName").toString();
  },
  layers:
  [
    MapLayers.starOwners,
    MapLayers.ownerBorders,
    MapLayers.nonFillerStars,
    MapLayers.fogOfWar,
    MapLayers.fleets,
  ],
};
export const income: MapRendererMapModeTemplate =
{
  key: "income",
  get displayName()
  {
    return localize("income_displayName").toString();
  },
  layers:
  [
    MapLayers.starIncome,
    MapLayers.nonFillerVoronoiLines,
    MapLayers.starLinks,
    MapLayers.nonFillerStars,
    MapLayers.fleets,
  ],
};
export const resources: MapRendererMapModeTemplate =
{
  key: "resources",
  get displayName()
  {
    return localize("resources_displayName").toString();
  },
  layers:
  [
    MapLayers.nonFillerVoronoiLines,
    MapLayers.starLinks,
    MapLayers.nonFillerStars,
    MapLayers.fogOfWar,
    MapLayers.fleets,
    MapLayers.resources,
  ],
};
