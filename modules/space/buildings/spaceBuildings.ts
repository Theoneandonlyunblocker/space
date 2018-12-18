import * as PIXI from "pixi.js";

import {englishLanguage} from "../../englishlanguage/englishLanguage";
import ModuleFile from "../../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../../src/ModuleFileInitializationPhase";

import buildingTemplates from "./BuildingTemplates";
import {iconSources, svgCache} from "./icons";


const spaceBuildings: ModuleFile =
{
  info:
  {
    key: "spaceBuildings",
    version: "0.1.0",
    author: "giraluna",
    description: "",
    modsToReplace: ["defaultBuildings"],
  },
  phaseToInitializeBefore: ModuleFileInitializationPhase.MapGen,
  supportedLanguages: [englishLanguage],
  initialize: () =>
  {
    const loader = new PIXI.loaders.Loader();

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
