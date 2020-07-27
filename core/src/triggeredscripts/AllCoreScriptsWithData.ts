import { TriggeredScriptsWithData } from "./TriggeredScriptsWithData";
import { Battle } from "../battle/Battle";
import { Player } from "../player/Player";
import { Game } from "../game/Game";
import { Star } from "../map/Star";
import { Unit } from "../unit/Unit";


// if there are hooks you'd like to be added, open an issue on github
export type AllCoreScripts =
{
  // battle
  onBattleFinish: (battle: Battle) => void;
  // diplomacy
  onWarDeclaration: (aggressor: Player, defender: Player, game: Game) => void;
  onFirstMeeting: (a: Player, b: Player, game: Game) => void;
  // game
  afterGameInit: (game: Game) => void;
  beforePlayerTurnEnd: (game: Game) => void;
  // player
  onPlayerDeath: (player: Player) => void;
  onPlayerResourcesChange: (player: Player) => void;
  onPlayerIncomeChange: (player: Player) => void;
  onPlayerResearchSpeedChange: (player: Player) => void;
  // star
  onStarOwnerChange: (star: Star, oldOwner: Player, newOwner: Player) => void;
  // unit
  onUnitRemovedFromPlayer: (unit: Unit) => void;
  onUnitCapture: (unit: Unit, oldPlayer: Player, newPlayer: Player) => void;
};

export type AllCoreScriptsWithData = TriggeredScriptsWithData<AllCoreScripts>;

export type PartialCoreScriptsWithData =
{
  [K in keyof AllCoreScriptsWithData]?: Partial<AllCoreScriptsWithData[K]>;
};
