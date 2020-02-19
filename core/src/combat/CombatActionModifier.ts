import { FlatAndMultiplierAdjustment } from "../generic/FlatAndMultiplierAdjustment";
import { CombatActionPrimitivesWithValues } from "./CombatActionPrimitiveTemplate";


export interface CombatActionModifier
{
  // TODO 2020.02.15 | can't this be something pther than flatandmultiplieradjustment?
  // or i guess allow attaching other data here. necessary for things like useAbilityAction
  primitives: CombatActionPrimitivesWithValues<Partial<FlatAndMultiplierAdjustment>>;
  flags?: Set<string>;
}
