import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";
import {svgCache} from "../../src/svgCache";
import SubEmblemTemplate from "../../src/templateinterfaces/SubEmblemTemplate";

import SubEmblemTemplates from "./SubEmblemTemplates";


const defaultEmblems: ModuleFile =
{
  key: "defaultEmblems",
  metaData:
  {
    name: "Default Emblems",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.Setup,
  supportedLanguages: "all",
  loadAssets: (onLoaded: () => void) =>
  {
    const loader = new PIXI.loaders.Loader();

    for (const templateKey in SubEmblemTemplates)
    {
      const template = SubEmblemTemplates[templateKey];
      loader.add(
      {
        url: template.src,
        loadType: 1, // XML
      });
    }

    loader.load(() =>
    {
      for (const templateKey in SubEmblemTemplates)
      {
        const template = SubEmblemTemplates[templateKey];
        const response = <XMLDocument> loader.resources[template.src].data;
        const svgDoc = <SVGElement> response.children[0];
        svgCache[template.src] = svgDoc;
      }

      onLoaded();
    });
  },
  constructModule: (moduleData: ModuleData) =>
  {
    moduleData.copyTemplates<SubEmblemTemplate>(SubEmblemTemplates, "SubEmblems");

    return moduleData;
  },
};

export default defaultEmblems;
