import {PlayerRaceTemplate} from "../../../src/templateinterfaces/PlayerRaceTemplate";

import Name from "../../../src/Name";

import
{
  getRandomProperty,
} from "../../../src/utility";

import {generateIndependentFleet} from "../../common/generateIndependentFleet";
import {generateIndependentPlayer} from "../../common/generateIndependentPlayer";
import * as TechnologyTemplates from "../../defaulttechnologies/TechnologyTemplates";
import DefaultAIConstructor from "../../defaultai/mapai/DefaultAIConstructor";


import
{
  defaultRaceTechnologyValues,
  mergeTechnologyValues,
  getDefaultUnits,
} from "../common";

const wormThings: PlayerRaceTemplate =
{
  type: "wormThings",
  displayName: new Name("Worm Things", true),
  description: "The gross guys",
  distributionData:
  {
    weight: 0,
    distributionGroups: [],
  },

  getBuildableUnitTypes: (player) =>
  {
    return getDefaultUnits().filter((unitTemplate) =>
    {
      return !unitTemplate.technologyRequirements ||
        player.meetsTechnologyRequirements(unitTemplate.technologyRequirements);
    });
  },

  getUnitName: (unitTemplate) =>
  {
    return `Infested ${unitTemplate.displayName}`;
  },
  getUnitPortrait: (unitTemplate, allTemplates) =>
  {
    return getRandomProperty(allTemplates);
  },

  generateIndependentPlayer: (emblemTemplates) =>
  {
    return generateIndependentPlayer(wormThings);
  },
  generateIndependentFleet: (player, location, globalStrength, localStrength,
    maxUnitsPerSideInBattle) =>
  {
    return generateIndependentFleet(wormThings, player, location,
      globalStrength, localStrength, maxUnitsPerSideInBattle);
  },


  technologies: mergeTechnologyValues(defaultRaceTechnologyValues,
  [
    {
      tech: TechnologyTemplates.test2,
      startingLevel: 1,
      maxLevel: 5
    }
  ]),

  getAITemplateConstructor: (player) => DefaultAIConstructor
}

export default wormThings;
