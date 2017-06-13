import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";

import {ja} from "./jaLanguage";

/* tslint:disable:no-import-side-effect */
import "localization/options/ja";

export const translationTest: ModuleFile =
{
  key: "translationTest",
  metaData:
  {
    name: "translation test",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.setup,
  supportedLanguages: [ja],
  constructModule: (moduleData: ModuleData) =>
  {
    return moduleData;
  },
};
