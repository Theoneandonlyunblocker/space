import {ModuleData} from "../../src/ModuleData";
import {ModuleFile} from "../../src/ModuleFile";
import {ModuleFileInitializationPhase} from "../../src/ModuleFileInitializationPhase";
import {emblemSources, svgCache} from "./assets";

import {subEmblemTemplates} from "./subEmblemTemplates";

import * as moduleInfo from "./moduleInfo.json";


export const defaultEmblems: ModuleFile =
{
  info: moduleInfo,
  phaseToInitializeBefore: ModuleFileInitializationPhase.GameSetup,
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
