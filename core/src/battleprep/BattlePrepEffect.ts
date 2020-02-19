import {BattlePrep} from "../battleprep/BattlePrep";
import { FlatAndMultiplierAdjustment } from "../generic/FlatAndMultiplierAdjustment";


export type BattlePrepEffect = (
  strength: number,
  battlePrep: BattlePrep,
) => void;

export type BattlePrepEffectWithAdjustment =
{
  effect: BattlePrepEffect;
  adjustment: Partial<FlatAndMultiplierAdjustment>;
};
