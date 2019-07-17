import * as core from "../modules/core/moduleInfo.json";
import * as defaultAi from "../modules/defaultai/moduleInfo.json";
import * as defaultAttitudeModifiers from "../modules/defaultattitudemodifiers/moduleInfo.json";
import * as defaultEmblems from "../modules/defaultemblems/moduleInfo.json";
import * as defaultNotifications from "../modules/defaultnotifications/moduleInfo.json";
import * as drones from "../modules/drones/moduleInfo.json";
import * as paintingPortraits from "../modules/paintingportraits/moduleInfo.json";
import * as englishLanguageSupport from "../modules/englishlanguage/moduleInfo.json";
import * as defaultUi from "../modules/defaultui/moduleInfo.json";
import * as space from "../modules/space/moduleInfo.json";
import * as spaceBackgrounds from "../modules/space/backgrounds/moduleInfo.json";
import * as spaceBattleSfx from "../modules/space/battlesfx/moduleInfo.json";
import * as spaceBuildings from "../modules/space/buildings/moduleInfo.json";
import * as spaceItems from "../modules/space/items/moduleInfo.json";
import * as spaceMapgen from "../modules/space/mapgen/moduleInfo.json";
import * as spaceMapModes from "../modules/space/mapmodes/moduleInfo.json";
import * as spaceRaces from "../modules/space/races/moduleInfo.json";
import * as spaceResources from "../modules/space/resources/moduleInfo.json";
import * as spaceTechnologies from "../modules/space/technologies/moduleInfo.json";
import * as spaceUnits from "../modules/space/units/moduleInfo.json";

import {ModuleInfo} from "../src/ModuleInfo";


export const defaultModules: ModuleInfo[] =
[
  core,
  englishLanguageSupport,

  defaultUi,
  defaultEmblems,
  defaultAi,
  defaultAttitudeModifiers,
  paintingPortraits,
  defaultNotifications,
  space,
  spaceBackgrounds,
  spaceBattleSfx,
  spaceBuildings,
  spaceItems,
  spaceMapgen,
  spaceMapModes,
  spaceRaces,
  spaceResources,
  spaceTechnologies,
  spaceUnits,
  drones,
];

// TODO 2019.05.28 | global defaultModules
(<any>window).defaultModules = defaultModules;
