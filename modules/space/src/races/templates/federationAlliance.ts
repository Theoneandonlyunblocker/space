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


export const federationAlliance: RaceTemplate =
{
  type: "federationAlliance",
  get displayName()
  {
    return localizeName("federationAlliance")();
  },
  description: "The good guys",
  distributionData:
  {
    weight: 0,
    distributionGroups: [],
  },
  getBuildableBuildings: () =>
  {
    return [
      ...getDefaultBuildableBuildings(),
      buildings.commercialPort,
    ];
  },
  getBuildableItems: () =>
  {
    return [
      ...getDefaultBuildableItems(),
      items.bombLauncher3,
    ];
  },
  getBuildableUnits: () =>
  {
    return [
      ...getDefaultBuildableUnits(),
      units.commandShip,
    ];
  },
  getPlayerName: player => player.isIndependent ?
    localizeName("federationAllianceIndependents")() :
    localizeName("genericPlayer")(player.id),
  getFleetName: fleet => localizeName("genericFleet")(fleet.id),
  getUnitName: unitTemplate =>
  {
    return `Federation ${unitTemplate.displayName}`;
  },
  getUnitPortrait: (unitTemplate, allPortraits) => getRandomProperty(allPortraits),
  generateIndependentPlayer: emblemTemplates =>
  {
    const player = generateIndependentPlayer(federationAlliance);

    return player;
  },
  generateIndependentFleets: (player, location, globalStrength, localStrength,
    maxUnitsPerSideInBattle) =>
  {
    return generateIndependentFleets(federationAlliance, player, location,
      globalStrength, localStrength, maxUnitsPerSideInBattle);
  },
  technologies: mergeTechnologyValues(defaultRaceTechnologyValues,
  [
    {
      tech: TechnologyTemplates.test1,
      startingLevel: 1,
      maxLevel: 5,
    },
  ]),
  getAiTemplateConstructor: player => defaultAiConstructor,
};
