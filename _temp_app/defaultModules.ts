import {core} from "../modules/core/core";
import {defaultAi} from "../modules/defaultai/defaultAi";
import {defaultAttitudeModifiers} from "../modules/defaultattitudemodifiers/defaultAttitudeModifiers";
import {defaultEmblems} from "../modules/defaultemblems/defaultEmblems";
import {defaultNotifications} from "../modules/defaultnotifications/defaultNotifications";
import {drones} from "../modules/drones/moduleFile";
import {paintingPortraits} from "../modules/paintingportraits/paintingPortraits";
import {englishLanguageSupport} from "../modules/englishlanguage/englishLanguageSupport";
import {space} from "../modules/space/moduleFile";
import {defaultUi} from "../modules/defaultui/defaultUi";


export const defaultModules =
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
