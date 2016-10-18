/// <reference path="../../lib/pixi.d.ts" />

import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";

import {raceTemplates} from "./raceTemplate";
import {unitTemplates} from "./unitTemplates";

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
  loadAssets: (onLoaded) =>
  {
    const loader = new PIXI.loaders.Loader();
    loader.add("placeHolder", "img/placeholder.png");
    loader.load(() =>
    {
      onLoaded();
    });
  },
  constructModule: (moduleData: ModuleData) =>
  {
    moduleData.copyTemplates(unitTemplates, "Units");
    moduleData.copyTemplates(raceTemplates, "Races");

    return moduleData;
  },
};
