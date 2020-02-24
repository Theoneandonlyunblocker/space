import { FlatAndMultiplierAdjustment } from "../generic/FlatAndMultiplierAdjustment";
import { CombatActionPrimitivesWithValues } from "./CombatActionPrimitiveTemplate";


export interface CombatActionModifier
{
  // can't this be something pther than FlatAndMultiplierAdjustment?
  // or i guess allow attaching other data here. necessary for things like useAbilityAction
  //
  // is it? why would anything need to know something that can't be expressed through primitives & flags?
  // flags should be able to carry data for things like "when using ability X, do Y"
  primitives: CombatActionPrimitivesWithValues<Partial<FlatAndMultiplierAdjustment>>;
  flags?: Set<string>;
}
