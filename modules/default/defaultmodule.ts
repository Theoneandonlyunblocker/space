/// <reference path="../../src/moduledata.ts" />

/// <reference path="graphics/drawnebula.ts" />

/// <reference path="mapgen/spiralgalaxy.ts" />
/// <reference path="mapgen/test.ts" />

/// <reference path="templates/abilities.ts" />
/// <reference path="templates/attitudemodifiers.ts" />
/// <reference path="templates/battlesfx.ts" />
/// <reference path="templates/buildings.ts" />
/// <reference path="templates/effects.ts" />
/// <reference path="templates/items.ts" />
/// <reference path="templates/passiveskills.ts" />
/// <reference path="templates/personalities.ts" />
/// <reference path="templates/resources.ts" />
/// <reference path="templates/statuseffects.ts" />
/// <reference path="templates/subemblems.ts" />
/// <reference path="templates/unitarchetypes.ts" />
/// <reference path="templates/unitfamilies.ts" />
/// <reference path="templates/units.ts" />

module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export var moduleFile: IModuleFile =
      {
        metaData:
        {
          name: "default",
          version: "6.9",
          author: "me",
          description: "default module"
        },
        constructModule: function(moduleData: ModuleData)
        {
          moduleData.copyAllTemplates(DefaultModule.Templates);

          moduleData.mapBackgroundDrawingFunction = function(
            map: GalaxyMap, renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer)
          {
            return drawNebula(renderer, map.seed);
          }

          return moduleData;
        }
      }
    }
  }
}
