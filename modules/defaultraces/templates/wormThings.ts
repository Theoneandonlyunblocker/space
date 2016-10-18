import {PlayerRaceTemplate} from "../../../src/templateinterfaces/PlayerRaceTemplate";

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
  key: "wormThings",
  displayName: "Worm Things",
  description: "The gross guys",

  technologies: mergeTechnologyValues(defaultRaceTechnologyValues,
  [
    {
      tech: TechnologyTemplates.test2,
      startingLevel: 1,
      maxLevel: 5
    }
  ]),
  getBuildableUnitTypes: getDefaultUnits,
  getAITemplateConstructor: (player) => DefaultAIConstructor
}

export default wormThings;
