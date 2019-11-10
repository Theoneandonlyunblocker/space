import * as common from "modules/common/moduleInfo.json";
import * as defaultAi from "modules/defaultai/moduleInfo.json";
import * as defaultAttitudeModifiers from "modules/defaultattitudemodifiers/moduleInfo.json";
import * as defaultEmblems from "modules/defaultemblems/moduleInfo.json";
import * as defaultNotifications from "modules/defaultnotifications/moduleInfo.json";
import * as drones from "modules/drones/moduleInfo.json";
import * as paintingPortraits from "modules/paintingportraits/moduleInfo.json";
import * as englishLanguageSupport from "modules/englishlanguage/moduleInfo.json";
import * as defaultUi from "modules/defaultui/moduleInfo.json";
import * as space from "modules/space/moduleInfo.json";
import * as money from "modules/money/moduleInfo.json";
import * as titans from "modules/titans/moduleInfo.json";

import {ModuleInfo} from "core/src/modules/ModuleInfo";


export const defaultModules: ModuleInfo[] =
[
  common,
  englishLanguageSupport,
  money,

  defaultUi,
  defaultEmblems,
  defaultAi,
  defaultAttitudeModifiers,
  paintingPortraits,
  defaultNotifications,
  space,
  drones,
  titans,
];
