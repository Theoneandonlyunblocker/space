import {Name} from "../../src/Name";
import {Player} from "../../src/player/Player";

import {RaceTemplate} from "../../src/templateinterfaces/RaceTemplate";


export function generateIndependentPlayer(
  race: RaceTemplate,
): Player
{
  const player = new Player(
  {
    isAi: true,
    isIndependent: true,

    race: race,
    money: -1,

    name: new Name(`Independent ${race.displayName}`, race.displayName.isPlural),
  });

  player.colorAlpha = 0.66;

  return player;
}
