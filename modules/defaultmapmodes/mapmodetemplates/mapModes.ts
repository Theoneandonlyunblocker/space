import MapRendererMapModeTemplate from "../../../src/templateinterfaces/maprenderermapmodetemplate";

import * as MapLayers from "../allMapLayerTemplates";

export const defaultMapMode: MapRendererMapModeTemplate =
{
  key: "defaultMapMode",
  displayName: "Default",
  layers:
  [
    MapLayers.nonFillerVoronoiLines,
    MapLayers.starOwners,
    MapLayers.ownerBorders,
    MapLayers.starLinks,
    MapLayers.nonFillerStars,
    MapLayers.fogOfWar,
    MapLayers.fleets
  ]
}
export const noStatic: MapRendererMapModeTemplate =
{
  key: "noStatic",
  displayName: "No Static Layers",
  layers:
  [
    MapLayers.starOwners,
    MapLayers.ownerBorders,
    MapLayers.nonFillerStars,
    MapLayers.fogOfWar,
    MapLayers.fleets
  ]
}
export const income: MapRendererMapModeTemplate =
{
  key: "income",
  displayName: "Income",
  layers:
  [
    MapLayers.starIncome,
    MapLayers.nonFillerVoronoiLines,
    MapLayers.starLinks,
    MapLayers.nonFillerStars,
    MapLayers.fleets
  ]
}
export const influence: MapRendererMapModeTemplate =
{
  key: "influence",
  displayName: "Player Influence",
  layers:
  [
    MapLayers.playerInfluence,
    MapLayers.nonFillerVoronoiLines,
    MapLayers.starLinks,
    MapLayers.nonFillerStars,
    MapLayers.fleets
  ]
}
export const resources: MapRendererMapModeTemplate =
{
  key: "resources",
  displayName: "Resources",
  layers:
  [
    MapLayers.debugSectors,
    MapLayers.nonFillerVoronoiLines,
    MapLayers.starLinks,
    MapLayers.nonFillerStars,
    MapLayers.fogOfWar,
    MapLayers.fleets,
    MapLayers.resources
  ]
}
