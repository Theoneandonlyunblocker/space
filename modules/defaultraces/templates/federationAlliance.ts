import {PlayerRaceTemplate} from "../../../src/templateinterfaces/PlayerRaceTemplate";

import * as TechnologyTemplates from "../../defaulttechnologies/TechnologyTemplates";
import DefaultAIConstructor from "../../defaultai/mapai/DefaultAIConstructor";

import
{
  defaultRaceTechnologyValues,
  mergeTechnologyValues
} from "../common";

const federationAlliance: PlayerRaceTemplate =
{
  key: "federationAlliance",
  displayName: "Federation Alliance",
  description: "The good guys",

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
