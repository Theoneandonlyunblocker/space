import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../src/ModuleFileInitializationPhase";
import {svgCache} from "../../src/svgCache";

import {englishLanguage} from "../englishlanguage/englishLanguage";

import {allScripts} from "./modulescripts/allScripts";


// TODO 2017.07.27 | move core gameplay stuff here
const core: ModuleFile =
{
  info:
  {
    key: "core",
    version: "0.1.0",
    author: "giraluna",
    description: "Core gameplay functionality",
  },
  phaseToInitializeBefore: ModuleFileInitializationPhase.GameSetup,
  supportedLanguages: [englishLanguage],
  initialize: () =>
  {
    const loader = new PIXI.loaders.Loader();

    const battleSceneFlagFadeUrl = "img/battleSceneFlagFade.svg";
    loader.add(
    {
      url: battleSceneFlagFadeUrl,
      loadType: 1, // XML
    });

    return new Promise(resolve =>
    {
      loader.load(() =>
      {
        const response = <XMLDocument> loader.resources[battleSceneFlagFadeUrl].data;
        const svgDoc = <SVGElement> response.children[0];
        svgCache[battleSceneFlagFadeUrl] = svgDoc;

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
