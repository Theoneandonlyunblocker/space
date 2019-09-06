import {RaceTemplate} from "core/templateinterfaces/RaceTemplate";

import
{
  getRandomProperty,
} from "core/generic/utility";

import {generateIndependentFleets} from "modules/common/generateIndependentFleets";
import {generateIndependentPlayer} from "modules/common/generateIndependentPlayer";
import {defaultAiConstructor} from "modules/defaultai/mapai/DefaultAiConstructor";
import * as TechnologyTemplates from "modules/space/technologies/technologyTemplates";
import * as items from "modules/space/items/itemTemplates";
import {unitTemplates as units} from "modules/space/units/unitTemplates";
import * as buildings from "modules/space/buildings/templates/otherBuildings";

import {getDefaultBuildableBuildings} from "../common/getDefaultBuildableBuildings";
import {getDefaultBuildableItems} from "../common/getDefaultBuildableItems";
import {getDefaultBuildableUnits} from "../common/getDefaultBuildableUnits";
import {defaultRaceTechnologyValues} from "../common/defaultRaceTechnologyValues";
import {mergeTechnologyValues} from "../common/utility";
import { localizeName } from "../localization/localize";


export const federationAlliance: RaceTemplate =
{
  type: "federationAlliance",
  get displayName()
  {
    return localizeName("federationAlliance");
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
    localizeName("federationAllianceIndependents") :
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
