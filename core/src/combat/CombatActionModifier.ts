import { FlatAndMultiplierAdjustment } from "../generic/FlatAndMultiplierAdjustment";
import { CombatActionPrimitivesWithValues } from "./CombatActionPrimitiveTemplate";


export interface CombatActionModifier
{
  primitives: CombatActionPrimitivesWithValues<Partial<FlatAndMultiplierAdjustment>>;
  flags?: Set<string>;
}
