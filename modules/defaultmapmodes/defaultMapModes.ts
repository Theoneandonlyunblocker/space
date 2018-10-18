/// <reference path="../../lib/pixi.d.ts" />

import {englishLanguage} from "../englishlanguage/englishLanguage";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";
import MapRendererLayerTemplate from "../../src/templateinterfaces/MapRendererLayerTemplate";
import MapRendererMapModeTemplate from "../../src/templateinterfaces/MapRendererMapModeTemplate";

import mapLayerTemplates from "./MapLayerTemplates";
import mapModeTemplates from "./MapModeTemplates";


const defaultMapModes: ModuleFile =
{
  metaData:
  {
    key: "defaultMapModes",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.Game,
  supportedLanguages: [englishLanguage],
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
