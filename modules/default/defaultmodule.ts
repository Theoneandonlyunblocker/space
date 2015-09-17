/// <reference path="../../src/moduledata.ts" />
/// <reference path="../../src/spritesheetcachingfunctions.ts" />

/// <reference path="graphics/drawnebula.ts" />
/// <reference path="graphics/maprendererlayers.ts" />
/// <reference path="graphics/maprenderermapmodes.ts" />

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
        key: "default",
        metaData:
        {
          name: "default",
          version: "6.9",
          author: "me",
          description: "default module"
        },
        loadAssets: function(onLoaded: () => void)
        {
          var loader = new PIXI.loaders.Loader();
          loader.add("emblems", "img\/emblems.json");
          loader.add("units", "img\/units.json");
          loader.add("buildings", "img\/buildings.json");

          loader.add("img\/fowTexture.png");
          loader.add("img\/battleEffects\/rocket.png");
          loader.add("explosion", "img\/battleEffects\/explosion.json");

          loader.load(function(loader: PIXI.loaders.Loader)
          {
            ["emblems", "units", "buildings"].forEach(function(spriteSheetName: string)
            {
              var json = loader.resources[spriteSheetName].data;
              var image = loader.resources[spriteSheetName + "_image"].data;
              cacheSpriteSheetAsImages(json, image);
            });

            onLoaded();
          });
        },
        constructModule: function(moduleData: ModuleData)
        {
          moduleData.copyAllTemplates(DefaultModule.Templates);
          moduleData.copyTemplates(DefaultModule.MapRendererLayers, "MapRendererLayers");
          moduleData.copyTemplates(DefaultModule.MapRendererMapModes, "MapRendererMapModes");

          moduleData.mapBackgroundDrawingFunction = drawNebula;
          moduleData.starBackgroundDrawingFunction = drawNebula;

          moduleData.defaultMap = DefaultModule.Templates.MapGen.spiralGalaxy

          return moduleData;
        }
      }
    }
  }
}
