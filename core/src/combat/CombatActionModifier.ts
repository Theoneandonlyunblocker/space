import { FlatAndMultiplierAdjustment } from "../generic/FlatAndMultiplierAdjustment";
import { CombatActionPrimitivesWithValues } from "./CombatActionPrimitive";


export interface CombatActionModifier
{
  key: string;
  flags?: Set<string>;
  primitives: CombatActionPrimitivesWithValues<Partial<FlatAndMultiplierAdjustment>>;
}
