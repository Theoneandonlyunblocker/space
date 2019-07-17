import * as PIXI from "pixi.js";

import {ModuleData} from "../../src/ModuleData";
import {GameModule} from "../../src/GameModule";
import {GameModuleInitializationPhase} from "../../src/GameModuleInitializationPhase";

import {allScripts} from "./modulescripts/allScripts";

import * as moduleInfo from "./moduleInfo.json";


// TODO 2017.07.27 | move core gameplay stuff here
export const core: GameModule =
{
  info: moduleInfo,
  phaseToInitializeBefore: GameModuleInitializationPhase.GameSetup,
  supportedLanguages: "all",
  initialize: (baseUrl) =>
  {
    const loader = new PIXI.Loader();

    const placeHolderResourceName = "placeHolder";
    const placeHolderUrl = "img/placeholder.png";
    // also adds to pixi texture cache when loaded which is all we want to do. kinda opaque
    // TODO 2018.12.19 | actually cache this somewhere. currently being referred by absolute path all over the place
    loader.add(placeHolderResourceName, placeHolderUrl);

    return new Promise(resolve =>
    {
      loader.load(resolve);
    });
  },
  addToModuleData: (moduleData: ModuleData) =>
  {
    moduleData.scripts.add(allScripts);

    return moduleData;
  },
};
