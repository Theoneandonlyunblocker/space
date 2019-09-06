import * as PIXI from "pixi.js";

import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {GameModule} from "src/modules/GameModule";
import {GameModuleInitializationPhase} from "src/modules/GameModuleInitializationPhase";

import {buildingTemplates} from "./buildingTemplates";
import {iconSources, svgCache} from "./resources";

import * as moduleInfo from "./moduleInfo.json";


export const spaceBuildings: GameModule =
{
  info: moduleInfo,
  phaseToInitializeBefore: GameModuleInitializationPhase.MapGen,
  supportedLanguages: [englishLanguage],
  initialize: (baseUrl) =>
  {
    const loader = new PIXI.Loader(baseUrl);

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
