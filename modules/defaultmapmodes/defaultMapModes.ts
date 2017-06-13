/// <reference path="../../lib/pixi.d.ts" />

import MapLayerTemplates from "./MapLayerTemplates";
import MapModeTemplates from "./MapModeTemplates";

import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";

import MapRendererLayerTemplate from "../../src/templateinterfaces/MapRendererLayerTemplate";
import MapRendererMapModeTemplate from "../../src/templateinterfaces/MapRendererMapModeTemplate";

import * as Languages from "../common/defaultLanguages";

const defaultMapModes: ModuleFile =
{
  key: "defaultMapModes",
  metaData:
  {
    name: "Default map modes",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.game,
  supportedLanguages: [Languages.en],
  loadAssets: function(onLoaded: () => void)
  {
    const loader = new PIXI.loaders.Loader();

    loader.add("modules/defaultmapmodes/img/fowTexture.png");
    loader.load(function(loader: PIXI.loaders.Loader)
    {
      onLoaded();
    });
  },
  constructModule: function(moduleData: ModuleData)
  {
    moduleData.copyTemplates<MapRendererLayerTemplate>(MapLayerTemplates, "MapRendererLayers");
    moduleData.copyTemplates<MapRendererMapModeTemplate>(MapModeTemplates, "MapRendererMapModes");

    return moduleData;
  },
};

export default defaultMapModes;
