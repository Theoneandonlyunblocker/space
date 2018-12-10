import * as PIXI from "pixi.js";

import {englishLanguage} from "../../englishlanguage/englishLanguage";
import ModuleFile from "../../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../../src/ModuleFileInitializationPhase";

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
  phaseToInitializeBefore: ModuleFileInitializationPhase.GameStart,
  supportedLanguages: [englishLanguage],
  initialize: () =>
  {
    const loader = new PIXI.loaders.Loader();

    loader.add("modules/space/mapmodes/img/fowTexture.png");

    return new Promise(resolve =>
    {
      loader.load(resolve);
    });
  },
  addToModuleData: (moduleData) =>
  {
    moduleData.copyTemplates(mapLayerTemplates, "MapRendererLayers");
    moduleData.copyTemplates(mapModeTemplates, "MapRendererMapModes");

    return moduleData;
  },
};

export default defaultMapModes;
