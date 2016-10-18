import {RaceTemplate} from "./RaceTemplate";

import AITemplateConstructor from "./AITemplateConstructor";
import RaceTechnologyValue from "./RaceTechnologyValue";

import Player from "../Player";

export interface PlayerRaceTemplate extends RaceTemplate
{
  technologies: RaceTechnologyValue[];
  getAITemplateConstructor: (player: Player) => AITemplateConstructor<any>;
}