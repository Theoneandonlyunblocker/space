import * as Languages from "../../localization/defaultLanguages";
import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";
import MapGenTemplate from "../../src/templateinterfaces/MapGenTemplate";
import TemplateCollection from "../../src/templateinterfaces/TemplateCollection";

import spiralGalaxy from "./templates/spiralGalaxy";
import tinierSpiralGalaxy from "./templates/tinierSpiralGalaxy";


const Templates: TemplateCollection<MapGenTemplate> =
{
  [spiralGalaxy.key]: spiralGalaxy,
  [tinierSpiralGalaxy.key]: tinierSpiralGalaxy,
};

const defaultMapGen: ModuleFile =
{
  key: "defaultMapGen",
  metaData:
  {
    name: "Default map gen",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.Setup,
  supportedLanguages: [Languages.en],
  constructModule: (moduleData: ModuleData) =>
  {
    moduleData.copyTemplates<MapGenTemplate>(Templates, "MapGen");

    if (!moduleData.defaultMap)
    {
      moduleData.defaultMap = spiralGalaxy;
    }

    return moduleData;
  },
};

export default defaultMapGen;
