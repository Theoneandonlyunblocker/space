// import idGenerators from "../../src/idGenerators";
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
    isAI: false,
    isIndependent: true,

    race: race,
    money: -1,
  });
}
