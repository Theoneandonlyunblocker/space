import * as PIXI from "pixi.js";

import {englishLanguage} from "../../englishlanguage/englishLanguage";
import ModuleFile from "../../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../../src/ModuleFileInitializationPhase";

import buildingTemplates from "./buildingTemplates";
import {iconSources, svgCache} from "./resources";

import * as moduleInfo from "./moduleInfo.json";


const spaceBuildings: ModuleFile =
{
  info: moduleInfo,
  phaseToInitializeBefore: ModuleFileInitializationPhase.MapGen,
  supportedLanguages: [englishLanguage],
  initialize: (baseUrl) =>
  {
    const loader = new PIXI.loaders.Loader(baseUrl);

    for (const key in iconSources)
    {
      loader.add(
      {
        url: iconSources[key],
        loadType: 1, // XML
      });
    }

    return new Promise(resolve =>
    {
      loader.load(() =>
      {
        for (const key in iconSources)
        {
          const response = <XMLDocument> loader.resources[iconSources[key]].data;
          const svgDoc = <SVGElement> response.children[0];
          svgCache[key] = svgDoc;
        }

        resolve();
      });
    });
  },
  addToModuleData: (moduleData) =>
  {
    moduleData.copyTemplates(buildingTemplates, "Buildings");

    return moduleData;
  },
};

export default spaceBuildings;
