/// <reference path="../../lib/pixi.d.ts" />

import app from "../../src/App"; // TODO global
import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";

import {abilityTemplates} from "./abilities";
import {raceTemplates} from "./raceTemplate";
import {statusEffectTemplates} from "./statusEffects";
import {unitTemplates} from "./unitTemplates";

import * as Languages from "../common/defaultLanguages";

export const drones: ModuleFile =
{
  key: "drones",
  metaData:
  {
    name: "Drones",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.setup,
  supportedLanguages: [Languages.en, Languages.ja],
  loadAssets: onLoaded =>
  {
    const placeHolderResourceName = "placeHolder";
    const placeHolderURL = "img/placeholder.png";

    const loader = new PIXI.loaders.Loader();
    loader.add(placeHolderResourceName, placeHolderURL);
    loader.load(() =>
    {
      const image = loader.resources[placeHolderResourceName].data;
      app.images[placeHolderURL] = image;
      onLoaded();
    });
  },
  constructModule: (moduleData: ModuleData) =>
  {
    moduleData.copyTemplates(abilityTemplates, "Abilities");
    moduleData.copyTemplates(raceTemplates, "Races");
    moduleData.copyTemplates(statusEffectTemplates, "StatusEffects");
    moduleData.copyTemplates(unitTemplates, "Units");

    return moduleData;
  },
};
