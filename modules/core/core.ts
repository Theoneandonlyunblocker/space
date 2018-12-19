import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../src/ModuleFileInitializationPhase";
import {svgCache} from "../../src/svgCache";

import {englishLanguage} from "../englishlanguage/englishLanguage";

import {allScripts} from "./modulescripts/allScripts";

import * as moduleInfo from "./moduleInfo.json";


// TODO 2017.07.27 | move core gameplay stuff here
const core: ModuleFile =
{
  info: moduleInfo,
  phaseToInitializeBefore: ModuleFileInitializationPhase.GameSetup,
  supportedLanguages: [englishLanguage],
  initialize: (baseUrl) =>
  {
    const loader = new PIXI.loaders.Loader();

    const battleSceneFlagFadeUrl = baseUrl + "img/battleSceneFlagFade.svg";
    loader.add(
    {
      url: battleSceneFlagFadeUrl,
      loadType: 1, // XML
    });

    const placeHolderResourceName = "placeHolder";
    const placeHolderUrl = baseUrl + "img/placeholder.png";
    // also adds to pixi texture cache when loaded which is all we want to do. kinda opaque
    // TODO 2018.12.19 | actually cache this somewhere. currently being referred by absolute path all over the place
    loader.add(placeHolderResourceName, placeHolderUrl);

    return new Promise(resolve =>
    {
      loader.load(() =>
      {
        const response = <XMLDocument> loader.resources[battleSceneFlagFadeUrl].data;
        const svgDoc = <SVGElement> response.children[0];
        svgCache.battleSceneFlagFade = svgDoc;

        resolve();
      });
    });
  },
  addToModuleData: (moduleData: ModuleData) =>
  {
    moduleData.scripts.add(allScripts);

    return moduleData;
  },
};

export default core;
