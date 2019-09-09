import {ModuleData} from "core/src/modules/ModuleData";
import {GameModule} from "core/src/modules/GameModule";
import {GameModuleInitializationPhase} from "core/src/modules/GameModuleInitializationPhase";
import {emblemSources, svgCache} from "../assets/assets";

import {subEmblemTemplates} from "./subEmblemTemplates";

import * as moduleInfo from "../moduleInfo.json";


export const defaultEmblems: GameModule =
{
  info: moduleInfo,
  phaseToInitializeBefore: GameModuleInitializationPhase.GameSetup,
  supportedLanguages: "all",
  initialize: (baseUrl) =>
  {
    const loader = new PIXI.Loader(baseUrl);

    for (const key in emblemSources)
    {
      loader.add(
      {
        url: emblemSources[key],
        loadType: 1, // XML
      });
    }

    return new Promise(resolve =>
    {
      loader.load(() =>
      {
        for (const key in emblemSources)
        {
          const response = <XMLDocument> loader.resources[emblemSources[key]].data;
          const svgDoc = <SVGElement> response.children[0];
          svgCache[key] = svgDoc;
        }

        resolve();
      });
    });
  },
  addToModuleData: (moduleData: ModuleData) =>
  {
    moduleData.copyTemplates(subEmblemTemplates, "SubEmblems");

    return moduleData;
  },
};
