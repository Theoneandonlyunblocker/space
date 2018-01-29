import BattlePrep from "../BattlePrep";
import Unit from "../Unit";

declare type BattlePrepEffect = (unit: Unit, battlePrep: BattlePrep) => void;

export default BattlePrepEffect;
