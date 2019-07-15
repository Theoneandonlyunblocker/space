import * as core from "../modules/core/moduleInfo.json";
import * as defaultAi from "../modules/defaultai/moduleInfo.json";
import * as defaultAttitudeModifiers from "../modules/defaultattitudemodifiers/moduleInfo.json";
import * as defaultEmblems from "../modules/defaultemblems/moduleInfo.json";
import * as defaultNotifications from "../modules/defaultnotifications/moduleInfo.json";
import * as drones from "../modules/drones/moduleInfo.json";
import * as paintingPortraits from "../modules/paintingportraits/moduleInfo.json";
import * as englishLanguageSupport from "../modules/englishlanguage/moduleInfo.json";
import * as space from "../modules/space/moduleInfo.json";
import * as defaultUi from "../modules/defaultui/moduleInfo.json";

import {ModuleInfo} from "../src/ModuleInfo";


export const defaultModules: ModuleInfo[] =
[
  core,
  englishLanguageSupport,

  defaultUi,
  defaultEmblems,
  defaultAi,
  space,
  defaultAttitudeModifiers,
  paintingPortraits,
  defaultNotifications,
  drones,
];

// TODO 2019.05.28 | global defaultModules
(<any>window).defaultModules = defaultModules;
