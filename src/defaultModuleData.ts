import core from "../modules/core/core";
import defaultAi from "../modules/defaultai/defaultAi";
import defaultAttitudemodifiers from "../modules/defaultattitudemodifiers/defaultAttitudemodifiers";
import defaultBackgrounds from "../modules/defaultbackgrounds/defaultBackgrounds";
import defaultBuildings from "../modules/defaultbuildings/defaultBuildings";
import defaultEmblems from "../modules/defaultemblems/defaultEmblems";
import defaultItems from "../modules/defaultitems/defaultItems";
import defaultMapgen from "../modules/defaultmapgen/defaultMapgen";
import defaultMapmodes from "../modules/defaultmapmodes/defaultMapmodes";
import defaultNotifications from "../modules/defaultnotifications/defaultNotifications";
import defaultRaces from "../modules/defaultraces/defaultRaces";
import defaultRuleset from "../modules/defaultruleset/defaultRuleset";
import defaultTechnologies from "../modules/defaulttechnologies/defaultTechnologies";
import defaultUnits from "../modules/defaultunits/defaultUnits";
import {drones} from "../modules/drones/moduleFile";
import paintingPortraits from "../modules/paintingportraits/paintingPortraits";
import {englishLanguageSupport} from "../modules/englishlanguage/englishLanguageSupport";


import {default as ModuleFile} from "./ModuleFile";


export const defaultModuleData:
{
  moduleFiles: ModuleFile[];
} =
{
  moduleFiles:
  [
    core,
    englishLanguageSupport,

    defaultEmblems,
    defaultRuleset,
    defaultAi,
    defaultItems,
    defaultTechnologies,
    defaultAttitudemodifiers,
    defaultMapgen,
    defaultUnits,
    defaultBackgrounds,
    defaultMapmodes,
    paintingPortraits,
    defaultBuildings,
    defaultNotifications,
    defaultRaces,
    drones,
  ],
};
