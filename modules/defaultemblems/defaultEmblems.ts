import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../src/ModuleFileInitializationPhase";
import {svgCache} from "../../src/svgCache";

import subEmblemTemplates from "./SubEmblemTemplates";


const defaultEmblems: ModuleFile =
{
  metaData:
  {
    key: "defaultEmblems",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeInitializedBefore: ModuleFileInitializationPhase.GameSetup,
  supportedLanguages: "all",
  initialize: (onLoaded: () => void) =>
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

    loader.load(() =>
    {
      for (const templateKey in subEmblemTemplates)
      {
        const template = subEmblemTemplates[templateKey];
        const response = <XMLDocument> loader.resources[template.src].data;
        const svgDoc = <SVGElement> response.children[0];
        svgCache[template.src] = svgDoc;
      }

      onLoaded();
    });
  },
  addToModuleData: (moduleData: ModuleData) =>
  {
    moduleData.copyTemplates(subEmblemTemplates, "SubEmblems");

    return moduleData;
  },
};

export default defaultEmblems;
