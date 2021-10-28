import {RaceTemplate} from "core/src/templateinterfaces/RaceTemplate";

import {generateIndependentFleets} from "modules/baselib/src/generateIndependentFleets";
import {generateIndependentPlayer} from "modules/baselib/src/generateIndependentPlayer";
import {defaultAiConstructor} from "modules/defaultai/src/mapai/DefaultAiConstructor";
import * as TechnologyTemplates from "modules/space/src/technologies/technologyTemplates";

import {defaultRaceTechnologyValues} from "../common/defaultRaceTechnologyValues";
import {mergeTechnologyValues} from "../common/utility";
import { localizeName } from "modules/space/localization/localize";
import { getHumanLikeBuildableThings } from "../common/getHumanLikeBuildableThings";
import { activeModuleData } from "core/src/app/activeModuleData";
import { availabilityFlags as commonAvailabilityFlags } from "modules/baselib/src/availabilityFlags";


export const wormThings: RaceTemplate =
{
  type: "wormThings",
  get displayName()
  {
    return localizeName("wormThings")();
  },
  description: "The gross guys",
  distributionData:
  {
    weight: 0,
    distributionGroups: [],
  },
  getBuildableBuildings: () => getHumanLikeBuildableThings(activeModuleData.templates.buildings),
  getBuildableItems: () => getHumanLikeBuildableThings(activeModuleData.templates.items),
  getBuildableUnits: () => getHumanLikeBuildableThings(activeModuleData.templates.units),
  associatedAvailabilityFlags: [commonAvailabilityFlags.humanLike],
  getPlayerName: player => player.isIndependent ?
    localizeName("wormThingsIndependents")() :
    localizeName("genericPlayer")(player.id),
  getFleetName: fleet => localizeName("genericFleet")(fleet.id),
  getUnitName: unitTemplate => localizeName("infestedUnitName")(unitTemplate.displayName),
  getUnitPortrait: (unitTemplate, allPortraits) => allPortraits.getRandom(),
  generateIndependentPlayer: emblemTemplates =>
  {
    return generateIndependentPlayer(wormThings);
  },
  generateIndependentFleets: (player, location, globalStrength, localStrength,
    maxUnitsPerSideInBattle) =>
  {
    return generateIndependentFleets(wormThings, player, location,
      globalStrength, localStrength, maxUnitsPerSideInBattle);
  },
  technologies: mergeTechnologyValues(defaultRaceTechnologyValues,
  [
    {
      tech: TechnologyTemplates.test2,
      startingLevel: 1,
      maxLevel: 5,
    },
  ]),

  getAiTemplateConstructor: player => defaultAiConstructor,
};
