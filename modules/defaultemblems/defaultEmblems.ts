import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../src/ModuleFileInitializationPhase";
import {svgCache} from "../../src/svgCache";

import subEmblemTemplates from "./SubEmblemTemplates";


const defaultEmblems: ModuleFile =
{
  info:
  {
    key: "defaultEmblems",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  phaseToInitializeBefore: ModuleFileInitializationPhase.GameSetup,
  supportedLanguages: "all",
  initialize: () =>
  {
    const loader = new PIXI.loaders.Loader();

    for (const templateKey in subEmblemTemplates)
    {
      const template = subEmblemTemplates[templateKey];
      loader.add(
      {
        url: template.src,
        loadType: 1, // XML
      });
    }

    return new Promise(resolve =>
    {
      loader.load(() =>
      {
        for (const templateKey in subEmblemTemplates)
        {
          const template = subEmblemTemplates[templateKey];
          const response = <XMLDocument> loader.resources[template.src].data;
          const svgDoc = <SVGElement> response.children[0];
          svgCache[template.src] = svgDoc;
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

export default defaultEmblems;
