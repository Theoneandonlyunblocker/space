// import idGenerators from "../../src/idGenerators";
import Name from "../../src/Name";
import Player from "../../src/Player";
// import
// {
//   getRandomProperty,
// } from "../../src/utility";

import {RaceTemplate} from "../../src/templateinterfaces/RaceTemplate";
// import SubEmblemTemplate from "../../src/templateinterfaces/SubEmblemTemplate";

// import TemplateCollection from "../../src/templateinterfaces/TemplateCollection";

export function generateIndependentPlayer(
  race: RaceTemplate,
): Player
{
  return new Player(
  {
    isAI: true,
    isIndependent: true,

    race: race,
    money: -1,

    name: new Name(`Independent ${race.displayName}`, race.displayName.isPlural),
  });
}
