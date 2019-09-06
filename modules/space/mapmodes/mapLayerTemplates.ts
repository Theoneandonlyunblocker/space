import {MapRendererLayerTemplate} from "core/templateinterfaces/MapRendererLayerTemplate";
import {TemplateCollection} from "core/templateinterfaces/TemplateCollection";

import * as MapLayers from "./allMapLayerTemplates";


export const mapLayerTemplates: TemplateCollection<MapRendererLayerTemplate> =
{
  [MapLayers.nonFillerStars.key]: MapLayers.nonFillerStars,
  [MapLayers.starLinks.key]: MapLayers.starLinks,
  [MapLayers.fleets.key]: MapLayers.fleets,
  [MapLayers.nonFillerVoronoiLines.key]: MapLayers.nonFillerVoronoiLines,
  [MapLayers.resources.key]: MapLayers.resources,
  [MapLayers.starOwners.key]: MapLayers.starOwners,
  [MapLayers.fogOfWar.key]: MapLayers.fogOfWar,
  [MapLayers.ownerBorders.key]: MapLayers.ownerBorders,
  [MapLayers.starIncome.key]: MapLayers.starIncome,
  [MapLayers.terrain.key]: MapLayers.terrain,
};
