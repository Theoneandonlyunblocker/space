import MapRendererMapModeTemplate from "../../../src/templateinterfaces/maprenderermapmodetemplate.d.ts";
import * as MapRendererLayers from "../MapLayerTemplates.ts";

export const defaultMapMode: MapRendererMapModeTemplate =
{
  key: "defaultMapMode",
  displayName: "Default",
  layers:
  [
    MapRendererLayers.nonFillerVoronoiLines,
    MapRendererLayers.starOwners,
    MapRendererLayers.ownerBorders,
    MapRendererLayers.starLinks,
    MapRendererLayers.nonFillerStars,
    MapRendererLayers.fogOfWar,
    MapRendererLayers.fleets
  ]
}
export const noStatic: MapRendererMapModeTemplate =
{
  key: "noStatic",
  displayName: "No Static Layers",
  layers:
  [
    MapRendererLayers.starOwners,
    MapRendererLayers.ownerBorders,
    MapRendererLayers.nonFillerStars,
    MapRendererLayers.fogOfWar,
    MapRendererLayers.fleets
  ]
}
export const income: MapRendererMapModeTemplate =
{
  key: "income",
  displayName: "Income",
  layers:
  [
    MapRendererLayers.starIncome,
    MapRendererLayers.nonFillerVoronoiLines,
    MapRendererLayers.starLinks,
    MapRendererLayers.nonFillerStars,
    MapRendererLayers.fleets
  ]
}
export const influence: MapRendererMapModeTemplate =
{
  key: "influence",
  displayName: "Player Influence",
  layers:
  [
    MapRendererLayers.playerInfluence,
    MapRendererLayers.nonFillerVoronoiLines,
    MapRendererLayers.starLinks,
    MapRendererLayers.nonFillerStars,
    MapRendererLayers.fleets
  ]
}
export const resources: MapRendererMapModeTemplate =
{
  key: "resources",
  displayName: "Resources",
  layers:
  [
    MapRendererLayers.debugSectors,
    MapRendererLayers.nonFillerVoronoiLines,
    MapRendererLayers.starLinks,
    MapRendererLayers.nonFillerStars,
    MapRendererLayers.fogOfWar,
    MapRendererLayers.fleets,
    MapRendererLayers.resources
  ]
}
