import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";

import {RaceTemplate} from "../../src/templateinterfaces/RaceTemplate";

export const drones: ModuleFile =
{
  key: "drones",
  metaData:
  {
    name: "Drone race",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.setup,
  constructModule: (moduleData: ModuleData) =>
  {


    return moduleData;
  },
};
