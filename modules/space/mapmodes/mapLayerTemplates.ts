import MapRendererLayerTemplate from "../../../src/templateinterfaces/MapRendererLayerTemplate";
import TemplateCollection from "../../../src/templateinterfaces/TemplateCollection";

import * as MapLayers from "./allMapLayerTemplates";


const mapLayerTemplates: TemplateCollection<MapRendererLayerTemplate> =
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

export default mapLayerTemplates;
