import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";
import {svgCache} from "../../src/svgCache";

import * as Languages from "../../localization/defaultLanguages";

import {allScripts} from "./modulescripts/allScripts";


// TODO 2017.07.27 | move core gameplay stuff here
const core: ModuleFile =
{
  key: "core",
  metaData:
  {
    name: "core",
    version: "0.1.0",
    author: "giraluna",
    description: "Core gameplay functionality",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.Setup,
  supportedLanguages: [Languages.en],
  loadAssets: (onLoaded: () => void) =>
  {
    const loader = new PIXI.loaders.Loader();

    const battleSceneFlagFadeUrl = "img/battleSceneFlagFade.svg";
    loader.add(
    {
      url: battleSceneFlagFadeUrl,
      loadType: 1, // XML
    });

    loader.load(() =>
    {
      const response = <XMLDocument> loader.resources[battleSceneFlagFadeUrl].data;
      const svgDoc = <SVGElement> response.children[0];
      svgCache[battleSceneFlagFadeUrl] = svgDoc;

      onLoaded();
    });
  },
  constructModule: (moduleData: ModuleData) =>
  {
    moduleData.scripts.add(allScripts);

    return moduleData;
  },
};

export default core;
