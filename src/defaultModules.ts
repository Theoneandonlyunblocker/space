import core from "../modules/core/core";
import defaultAi from "../modules/defaultai/defaultAi";
import defaultAttitudemodifiers from "../modules/defaultattitudemodifiers/defaultAttitudemodifiers";
import defaultEmblems from "../modules/defaultemblems/defaultEmblems";
import defaultNotifications from "../modules/defaultnotifications/defaultNotifications";
import {drones} from "../modules/drones/moduleFile";
import paintingPortraits from "../modules/paintingportraits/paintingPortraits";
import {englishLanguageSupport} from "../modules/englishlanguage/englishLanguageSupport";
import {space} from "../modules/space/moduleFile";


export const defaultModules =
[
  core,
  englishLanguageSupport,

  defaultEmblems,
  defaultAi,
  space,
  defaultAttitudemodifiers,
  paintingPortraits,
  defaultNotifications,
  drones,
];
