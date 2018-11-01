import ModuleFile from "../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../src/ModuleFileInitializationPhase";

import {paintingPortraitTemplates} from "./paintingPortraitTemplates";


const paintingPortraits: ModuleFile =
{
  metaData:
  {
    key: "paintingPortraits",
    version: "0.1.0",
    author: "various artists",
    description: "old ppl",
  },
  needsToBeInitializedBefore: ModuleFileInitializationPhase.MapGen,
  supportedLanguages: "all",
  constructModule: (moduleData) =>
  {
    moduleData.copyTemplates(paintingPortraitTemplates, "Portraits");

    return moduleData;
  },
};

export default paintingPortraits;
