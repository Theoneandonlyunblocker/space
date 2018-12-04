import * as PIXI from "pixi.js";

import {englishLanguage} from "../englishlanguage/englishLanguage";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../src/ModuleFileInitializationPhase";
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
  needsToBeInitializedBefore: ModuleFileInitializationPhase.GameStart,
  supportedLanguages: [englishLanguage],
  initialize: (onLoaded) =>
  {
    const loader = new PIXI.loaders.Loader();

    loader.add("modules/defaultmapmodes/img/fowTexture.png");
    loader.load(onLoaded);
  },
  addToModuleData: (moduleData) =>
  {
    moduleData.copyTemplates<MapRendererLayerTemplate>(mapLayerTemplates, "MapRendererLayers");
    moduleData.copyTemplates<MapRendererMapModeTemplate>(mapModeTemplates, "MapRendererMapModes");

    return moduleData;
  },
};

export default defaultMapModes;
