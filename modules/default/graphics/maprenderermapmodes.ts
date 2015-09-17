/// <reference path="../../../src/templateinterfaces/imaprenderermapmodetemplate.d.ts" />
/// <reference path="maprendererlayers.ts" />

module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export module MapRendererMapModes
      {
        export var defaultMapMode: IMapRendererMapModeTemplate =
        {
          key: "defaultMapMode",
          displayName: "Default",
          layers:
          [
            {layer: MapRendererLayers.starOwners},
            {layer: MapRendererLayers.ownerBorders},
            {layer: MapRendererLayers.nonFillerVoronoiLines},
            {layer: MapRendererLayers.starLinks},
            {layer: MapRendererLayers.nonFillerStars},
            {layer: MapRendererLayers.fogOfWar},
            {layer: MapRendererLayers.fleets}
          ]
        }
        export var noStatic: IMapRendererMapModeTemplate =
        {
          key: "noStatic",
          displayName: "No Static Layers",
          layers:
          [
            {layer: MapRendererLayers.starOwners},
            {layer: MapRendererLayers.ownerBorders},
            {layer: MapRendererLayers.nonFillerStars},
            {layer: MapRendererLayers.fogOfWar},
            {layer: MapRendererLayers.fleets}
          ]
        }
        export var income: IMapRendererMapModeTemplate =
        {
          key: "income",
          displayName: "Income",
          layers:
          [
            {layer: MapRendererLayers.starIncome},
            {layer: MapRendererLayers.nonFillerVoronoiLines},
            {layer: MapRendererLayers.starLinks},
            {layer: MapRendererLayers.nonFillerStars},
            {layer: MapRendererLayers.fleets}
          ]
        }
        export var influence: IMapRendererMapModeTemplate =
        {
          key: "influence",
          displayName: "Player Influence",
          layers:
          [
            {layer: MapRendererLayers.playerInfluence},
            {layer: MapRendererLayers.nonFillerVoronoiLines},
            {layer: MapRendererLayers.starLinks},
            {layer: MapRendererLayers.nonFillerStars},
            {layer: MapRendererLayers.fleets}
          ]
        }
        export var resources: IMapRendererMapModeTemplate =
        {
          key: "resources",
          displayName: "Resources",
          layers:
          [
            {layer: MapRendererLayers.debugSectors},
            {layer: MapRendererLayers.nonFillerVoronoiLines},
            {layer: MapRendererLayers.starLinks},
            {layer: MapRendererLayers.nonFillerStars},
            {layer: MapRendererLayers.fogOfWar},
            {layer: MapRendererLayers.fleets},
            {layer: MapRendererLayers.resources}
          ]
        }
      }
    }
  }
}
