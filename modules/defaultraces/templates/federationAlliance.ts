import {PlayerRaceTemplate} from "../../../src/templateinterfaces/PlayerRaceTemplate";

import
{
  getRandomProperty,
} from "../../../src/utility";

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
  displayName: "Federation Alliance",
  description: "The good guys",
  distributionData:
  {
    rarity: 0,
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
    return generateIndependentPlayer(federationAlliance);
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
