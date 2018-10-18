/// <reference path="../../lib/pixi.d.ts" />

import {englishLanguage} from "../englishlanguage/englishLanguage";
import app from "../../src/App"; // TODO global
import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";

import {abilityTemplates} from "./abilities";
import {raceTemplates} from "./raceTemplate";
import {unitEffectTemplates} from "./unitEffects";
import {unitTemplates} from "./unitTemplates";


export const drones: ModuleFile =
{
  metaData:
  {
    key: "drones",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.Setup,
  supportedLanguages: [englishLanguage],
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
    moduleData.copyTemplates(unitEffectTemplates, "UnitEffects");
    moduleData.copyTemplates(unitTemplates, "Units");

    return moduleData;
  },
};
