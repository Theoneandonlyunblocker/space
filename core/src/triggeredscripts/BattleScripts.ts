import {Battle} from "../battle/Battle";

export interface BattleScripts
{
  battleFinish: (battle: Battle) => void;
}
