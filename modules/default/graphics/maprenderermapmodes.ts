/// <reference path="../../../src/templateinterfaces/imaprenderermapmodetemplate.d.ts" />
/// <reference path="maprendererlayers.ts" />

export namespace Modules
{
  export namespace DefaultModule
  {
    export namespace MapRendererMapModes
    {
      export var defaultMapMode: IMapRendererMapModeTemplate =
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
      export var noStatic: IMapRendererMapModeTemplate =
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
      export var income: IMapRendererMapModeTemplate =
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
      export var influence: IMapRendererMapModeTemplate =
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
      export var resources: IMapRendererMapModeTemplate =
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
    }
  }
}
