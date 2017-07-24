import {default as Battle} from "../Battle";

export interface BattleScripts
{
  battleFinish: ((battle: Battle) => void);
}
