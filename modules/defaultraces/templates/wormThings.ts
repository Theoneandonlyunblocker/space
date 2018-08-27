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
import * as items from "../../defaultitems/itemTemplates";
import {unitTemplates as units} from "../../defaultunits/unitTemplates";

import {getDefaultBuildableBuildings} from "../common/getDefaultBuildableBuildings";
import {getDefaultBuildableItems} from "../common/getDefaultBuildableItems";
import {getDefaultBuildableUnits} from "../common/getDefaultBuildableUnits";
import {defaultRaceTechnologyValues} from "../common/defaultRaceTechnologyValues";
import {mergeTechnologyValues} from "../common/utility";


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
  getBuildableBuildings: () =>
  {
    return getDefaultBuildableBuildings();
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

  getAiTemplateConstructor: player => defaultAiConstructor,
};

export default wormThings;
