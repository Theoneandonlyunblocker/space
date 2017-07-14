import {default as Player} from "./Player";


export let activePlayer: Player;

// changing this during the game will break things.
export function setActivePlayer(player: Player): void
{
  activePlayer = player;
}
