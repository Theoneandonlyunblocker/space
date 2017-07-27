import {default as ModuleFile} from "./ModuleFile";

import core from "../modules/core/core";

import defaultAI from "../modules/defaultai/defaultAI";
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

import paintingPortraits from "../modules/paintingportraits/paintingPortraits";

import {drones} from "../modules/drones/moduleFile";


export const defaultModuleData:
{
  moduleFiles: ModuleFile[],
} =
{
  moduleFiles:
  [
    core,

    defaultEmblems,
    defaultRuleset,
    defaultAI,
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
