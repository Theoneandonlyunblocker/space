import {default as Player} from "./Player";


// player from whose perspective the game is currently being played
// see Game.playerToAct for player whose turn it is to currently play
// TODO 2017.07.24 | maybe rename this to POV player or something...
export let activePlayer: Player;

// changing this during the game will break things
export function setActivePlayer(player: Player): void
{
  activePlayer = player;
}
