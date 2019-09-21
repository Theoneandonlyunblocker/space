import {RaceTemplate} from "core/src/templateinterfaces/RaceTemplate";

import
{
  getRandomProperty,
} from "core/src/generic/utility";

import {generateIndependentFleets} from "modules/common/generateIndependentFleets";
import {generateIndependentPlayer} from "modules/common/generateIndependentPlayer";
import {defaultAiConstructor} from "modules/defaultai/src/mapai/DefaultAiConstructor";
import * as TechnologyTemplates from "modules/space/src/technologies/technologyTemplates";
import * as items from "modules/space/src/items/itemTemplates";
import {unitTemplates as units} from "modules/space/src/units/unitTemplates";
import * as buildings from "modules/space/src/buildings/templates/otherBuildings";

import {getDefaultBuildableBuildings} from "../common/getDefaultBuildableBuildings";
import {getDefaultBuildableItems} from "../common/getDefaultBuildableItems";
import {getDefaultBuildableUnits} from "../common/getDefaultBuildableUnits";
import {defaultRaceTechnologyValues} from "../common/defaultRaceTechnologyValues";
import {mergeTechnologyValues} from "../common/utility";
import { localizeName } from "modules/space/localization/localize";


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
  getBuildableBuildings: () =>
  {
    return [
      ...getDefaultBuildableBuildings(),
      buildings.reserachLab,
    ];
  },
  getBuildableItems: () =>
  {
    return [
      ...getDefaultBuildableItems(),
      items.shieldPlating3,
    ];
  },
  getBuildableUnits: () =>
  {
    return [
      ...getDefaultBuildableUnits(),
      units.fighterSquadron,
    ];
  },
  getPlayerName: player => player.isIndependent ?
    localizeName("wormThingsIndependents")() :
    localizeName("genericPlayer")(player.id),
  getFleetName: fleet => localizeName("genericFleet")(fleet.id),
  getUnitName: unitTemplate => `Infested ${unitTemplate.displayName}`,
  getUnitPortrait: (unitTemplate, allPortraits) => getRandomProperty(allPortraits),
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
