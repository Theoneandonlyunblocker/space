import {PlayerRaceTemplate} from "../../../src/templateinterfaces/PlayerRaceTemplate";
import
{
  getRandomProperty,
} from "../../../src/utility";

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
  displayName: "Worm Things",
  description: "The gross guys",
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
    return `Infested ${unitTemplate.displayName}`;
  },
  getUnitPortrait: (unitTemplate, allTemplates) =>
  {
    return getRandomProperty(allTemplates);
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
