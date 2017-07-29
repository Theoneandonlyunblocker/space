import {RaceTemplate} from "../../../src/templateinterfaces/RaceTemplate";

import Name from "../../../src/Name";

import
{
  getRandomProperty,
} from "../../../src/utility";

import {generateIndependentFleets} from "../../common/generateIndependentFleets";
import {generateIndependentPlayer} from "../../common/generateIndependentPlayer";
import DefaultAIConstructor from "../../defaultai/mapai/DefaultAIConstructor";
import * as TechnologyTemplates from "../../defaulttechnologies/TechnologyTemplates";


import
{
  defaultRaceTechnologyValues,
  getDefaultUnits,
  mergeTechnologyValues,
} from "../common";

const wormThings: RaceTemplate =
{
  type: "wormThings",
  displayName: new Name("Worm Things", true),
  description: "The gross guys",
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
    return `Infested ${unitTemplate.displayName}`;
  },
  getUnitPortrait: (unitTemplate, allTemplates) =>
  {
    return getRandomProperty(allTemplates);
  },

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

  getAITemplateConstructor: player => DefaultAIConstructor,
};

export default wormThings;
