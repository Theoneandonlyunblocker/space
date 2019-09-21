import * as TechnologyTemplates from "modules/space/src/technologies/technologyTemplates";

import {RaceTechnologyValue} from "core/src/templateinterfaces/RaceTechnologyValue";


export const defaultRaceTechnologyValues: RaceTechnologyValue[] =
[
  {
    tech: TechnologyTemplates.stealth,
    startingLevel: 0,
    maxLevel: 9,
  },
  {
    tech: TechnologyTemplates.lasers,
    startingLevel: 0,
    maxLevel: 9,
  },
  {
    tech: TechnologyTemplates.missiles,
    startingLevel: 0,
    maxLevel: 9,
  },
];




