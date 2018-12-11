import {englishLanguage} from "../../englishlanguage/englishLanguage";
import ModuleData from "../../../src/ModuleData";
import ModuleFile from "../../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../../src/ModuleFileInitializationPhase";
import MapGenTemplate from "../../../src/templateinterfaces/MapGenTemplate";
import TemplateCollection from "../../../src/templateinterfaces/TemplateCollection";

import spiralGalaxy from "./templates/spiralGalaxy";
import tinierSpiralGalaxy from "./templates/tinierSpiralGalaxy";


const templates: TemplateCollection<MapGenTemplate> =
{
  [spiralGalaxy.key]: spiralGalaxy,
  [tinierSpiralGalaxy.key]: tinierSpiralGalaxy,
};

const defaultMapGen: ModuleFile =
{
  info:
  {
    key: "defaultMapGen",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  phaseToInitializeBefore: ModuleFileInitializationPhase.GameSetup,
  supportedLanguages: [englishLanguage],
  addToModuleData: (moduleData: ModuleData) =>
  {
    moduleData.copyTemplates(templates, "MapGen");

    if (!moduleData.defaultMap)
    {
      moduleData.defaultMap = spiralGalaxy;
    }

    return moduleData;
  },
};

export default defaultMapGen;
