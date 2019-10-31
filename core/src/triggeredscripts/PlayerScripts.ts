import {Player} from "../player/Player";

export interface PlayerScripts
{
  onDeath: (player: Player) => void;
  onResourcesChange: (player: Player) => void;
  onIncomeChange: (player: Player) => void;
  onResearchSpeedChange: (player: Player) => void;
}
