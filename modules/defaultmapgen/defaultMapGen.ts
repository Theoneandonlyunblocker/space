import {englishLanguage} from "../englishlanguage/englishLanguage";
import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";
import MapGenTemplate from "../../src/templateinterfaces/MapGenTemplate";
import TemplateCollection from "../../src/templateinterfaces/TemplateCollection";

import spiralGalaxy from "./templates/spiralGalaxy";
import tinierSpiralGalaxy from "./templates/tinierSpiralGalaxy";


const templates: TemplateCollection<MapGenTemplate> =
{
  [spiralGalaxy.key]: spiralGalaxy,
  [tinierSpiralGalaxy.key]: tinierSpiralGalaxy,
};

const defaultMapGen: ModuleFile =
{
  metaData:
  {
    key: "defaultMapGen",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.Setup,
  supportedLanguages: [englishLanguage],
  constructModule: (moduleData: ModuleData) =>
  {
    moduleData.copyTemplates<MapGenTemplate>(templates, "MapGen");

    if (!moduleData.defaultMap)
    {
      moduleData.defaultMap = spiralGalaxy;
    }

    return moduleData;
  },
};

export default defaultMapGen;
