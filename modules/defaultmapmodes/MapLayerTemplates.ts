import MapRendererLayerTemplate from "../../src/templateinterfaces/MapRendererLayerTemplate.d.ts";
import TemplateCollection from "../../src/templateinterfaces/TemplateCollection.d.ts";

import * as MapLayers from "./allMapLayerTemplates.ts";

const MapLayerTemplates: TemplateCollection<MapRendererLayerTemplate> =
{
  [MapLayers.debugSectors.key]: MapLayers.debugSectors,
  [MapLayers.nonFillerStars.key]: MapLayers.nonFillerStars,
  [MapLayers.playerInfluence.key]: MapLayers.playerInfluence,
  [MapLayers.starLinks.key]: MapLayers.starLinks,
  [MapLayers.fleets.key]: MapLayers.fleets,
  [MapLayers.nonFillerVoronoiLines.key]: MapLayers.nonFillerVoronoiLines,
  [MapLayers.resources.key]: MapLayers.resources,
  [MapLayers.starOwners.key]: MapLayers.starOwners,
  [MapLayers.fogOfWar.key]: MapLayers.fogOfWar,
  [MapLayers.ownerBorders.key]: MapLayers.ownerBorders,
  [MapLayers.starIncome.key]: MapLayers.starIncome,
}

export default MapLayerTemplates;
