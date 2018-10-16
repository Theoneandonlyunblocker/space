/// <reference path="../../lib/pixi.d.ts" />

import * as Languages from "../../localization/defaultLanguages";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";
import MapRendererLayerTemplate from "../../src/templateinterfaces/MapRendererLayerTemplate";
import MapRendererMapModeTemplate from "../../src/templateinterfaces/MapRendererMapModeTemplate";

import mapLayerTemplates from "./MapLayerTemplates";
import mapModeTemplates from "./MapModeTemplates";


const defaultMapModes: ModuleFile =
{
  key: "defaultMapModes",
  metaData:
  {
    key: "Default map modes",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.Game,
  supportedLanguages: [Languages.en],
  loadAssets: (onLoaded) =>
  {
    const loader = new PIXI.loaders.Loader();

    loader.add("modules/defaultmapmodes/img/fowTexture.png");
    loader.load(onLoaded);
  },
  constructModule: (moduleData) =>
  {
    moduleData.copyTemplates<MapRendererLayerTemplate>(mapLayerTemplates, "MapRendererLayers");
    moduleData.copyTemplates<MapRendererMapModeTemplate>(mapModeTemplates, "MapRendererMapModes");

    return moduleData;
  },
};

export default defaultMapModes;
