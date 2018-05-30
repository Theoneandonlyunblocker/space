/// <reference path="../../lib/pixi.d.ts" />

import MapLayerTemplates from "./MapLayerTemplates";
import MapModeTemplates from "./MapModeTemplates";

import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";

import MapRendererLayerTemplate from "../../src/templateinterfaces/MapRendererLayerTemplate";
import MapRendererMapModeTemplate from "../../src/templateinterfaces/MapRendererMapModeTemplate";

import * as Languages from "../../localization/defaultLanguages";


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
    moduleData.copyTemplates<MapRendererLayerTemplate>(MapLayerTemplates, "MapRendererLayers");
    moduleData.copyTemplates<MapRendererMapModeTemplate>(MapModeTemplates, "MapRendererMapModes");

    return moduleData;
  },
};

export default defaultMapModes;
