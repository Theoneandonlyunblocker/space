import {RaceTemplate} from "../../../src/templateinterfaces/RaceTemplate";

import Name from "../../../src/Name";

import
{
  getRandomProperty,
} from "../../../src/utility";

import {generateIndependentFleets} from "../../common/generateIndependentFleets";
import {generateIndependentPlayer} from "../../common/generateIndependentPlayer";
import defaultAiConstructor from "../../defaultai/mapai/DefaultAiConstructor";
import * as TechnologyTemplates from "../../defaulttechnologies/TechnologyTemplates";


import
{
  defaultRaceTechnologyValues,
  getDefaultUnits,
  mergeTechnologyValues,
} from "../common";


const federationAlliance: RaceTemplate =
{
  type: "federationAlliance",
  displayName: new Name("Federation Alliance", false),
  description: "The good guys",
  distributionData:
  {
    weight: 0,
    distributionGroups: [],
  },

  getBuildableUnitTypes: player =>
  {
    return getDefaultUnits().filter(unitTemplate =>
    {
      return !unitTemplate.technologyRequirements ||
        player.meetsTechnologyRequirements(unitTemplate.technologyRequirements);
    });
  },

  getUnitName: unitTemplate =>
  {
    return `Federation ${unitTemplate.displayName}`;
  },
  getUnitPortrait: (unitTemplate, allTemplates) =>
  {
    return getRandomProperty(allTemplates);
  },

  generateIndependentPlayer: emblemTemplates =>
  {
    const player = generateIndependentPlayer(federationAlliance);

    player.name = new Name(`${federationAlliance.displayName} Independents`, true);

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

export default federationAlliance;
