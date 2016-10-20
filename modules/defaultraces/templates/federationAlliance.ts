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

const federationAlliance: PlayerRaceTemplate =
{
  type: "federationAlliance",
  displayName: new Name("Federation Alliance", false),
  description: "The good guys",
  distributionData:
  {
    weight: 0,
    distributionGroups: [],
  },

  getBuildableUnitTypes: (player) =>
  {
    return getDefaultUnits().filter(unitTemplate =>
    {
      return !unitTemplate.technologyRequirements ||
        player.meetsTechnologyRequirements(unitTemplate.technologyRequirements);
    });
  },

  getUnitName: (unitTemplate) =>
  {
    return `Federation ${unitTemplate.displayName}`;
  },
  getUnitPortrait: (unitTemplate, allTemplates) =>
  {
    return getRandomProperty(allTemplates);
  },

  generateIndependentPlayer: (emblemTemplates) =>
  {
    const player = generateIndependentPlayer(federationAlliance);

    player.name = new Name(`${federationAlliance.displayName} Independents`, true);

    return player;
  },
  generateIndependentFleet: (player, location, globalStrength, localStrength,
    maxUnitsPerSideInBattle) =>
  {
    return generateIndependentFleet(federationAlliance, player, location,
      globalStrength, localStrength, maxUnitsPerSideInBattle);
  },

  technologies: mergeTechnologyValues(defaultRaceTechnologyValues,
  [
    {
      tech: TechnologyTemplates.test1,
      startingLevel: 1,
      maxLevel: 5
    }
  ]),

  getAITemplateConstructor: (player) => DefaultAIConstructor
}

export default federationAlliance;
