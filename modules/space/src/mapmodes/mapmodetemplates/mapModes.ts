import {MapRendererMapModeTemplate} from "core/src/templateinterfaces/MapRendererMapModeTemplate";
import { mapLayerTemplates } from "./../mapLayerTemplates";
import { localize } from "modules/space/localization/localize";


export const defaultMapMode: MapRendererMapModeTemplate =
{
  key: "defaultMapMode",
  get displayName()
  {
    return localize("defaultMapMode_displayName").toString();
  },
  layers:
  [
    mapLayerTemplates.nonFillerVoronoiLines,
    mapLayerTemplates.starOwners,
    mapLayerTemplates.ownerBorders,
    mapLayerTemplates.starLinks,
    mapLayerTemplates.nonFillerStars,
    mapLayerTemplates.fogOfWar,
    mapLayerTemplates.fleets,
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
    mapLayerTemplates.starOwners,
    mapLayerTemplates.ownerBorders,
    mapLayerTemplates.nonFillerStars,
    mapLayerTemplates.fogOfWar,
    mapLayerTemplates.fleets,
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
    mapLayerTemplates.starIncome,
    mapLayerTemplates.nonFillerVoronoiLines,
    mapLayerTemplates.starLinks,
    mapLayerTemplates.nonFillerStars,
    mapLayerTemplates.fleets,
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
    mapLayerTemplates.nonFillerVoronoiLines,
    mapLayerTemplates.starLinks,
    mapLayerTemplates.nonFillerStars,
    mapLayerTemplates.fogOfWar,
    mapLayerTemplates.fleets,
    mapLayerTemplates.resources,
  ],
};
