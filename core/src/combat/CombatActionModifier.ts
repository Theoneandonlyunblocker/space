import { FlatAndMultiplierAdjustment } from "../generic/FlatAndMultiplierAdjustment";
import { CombatActionPrimitivesWithValues } from "./CombatActionPrimitive";


export interface CombatActionModifier
{
  primitives: CombatActionPrimitivesWithValues<Partial<FlatAndMultiplierAdjustment>>;
  flags?: Set<string>;
}
