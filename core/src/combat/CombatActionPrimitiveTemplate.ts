import { CombatActionResults } from "./CombatActionResults";
import { FlatAndMultiplierAdjustment } from "../generic/FlatAndMultiplierAdjustment";
import { applyAdjustmentsObjects, PartialAdjustmentsObject } from "../generic/AdjustmentsObject";


export interface CombatActionPrimitiveTemplate<T>
{
  key: string;
  applyToResult: (value: T, result: CombatActionResults) => void;
}

export type CombatActionPrimitivesWithValues<T> =
{
  [key: string]:
  {
    primitive: CombatActionPrimitiveTemplate<any>;
    value: T;
  };
};

export function resolveCombatActionPrimitiveAdjustments(
  ...allPrimitivesWithAdjustments: CombatActionPrimitivesWithValues<Partial<FlatAndMultiplierAdjustment>>[]
): CombatActionPrimitivesWithValues<number>
{
  const allPresentPrimitives: {[key: string]: CombatActionPrimitiveTemplate<any>} = {};
  const allAdjustmentsObjects: PartialAdjustmentsObject<any>[] = [];

  allPrimitivesWithAdjustments.forEach(primitivesWithAdjustments =>
  {
    const adjustmentsObject: PartialAdjustmentsObject<any> = {};

    Object.keys(primitivesWithAdjustments).forEach(key =>
    {
      const {primitive, value: adjustment} = primitivesWithAdjustments[key];
      allPresentPrimitives[key] = primitive;

      adjustmentsObject[key] = adjustment;
    });

    allAdjustmentsObjects.push(adjustmentsObject);
  });

  const finalValuesByPrimitive = applyAdjustmentsObjects({}, ...allAdjustmentsObjects);
  const significantPrimitives = Object.keys(finalValuesByPrimitive).filter(key => finalValuesByPrimitive[key]);

  return significantPrimitives.reduce((significantPrimitivesWithResolvedValues, key) =>
  {
    significantPrimitivesWithResolvedValues[key] =
    {
      primitive: allPresentPrimitives[key],
      value: finalValuesByPrimitive[key],
    };

    return significantPrimitivesWithResolvedValues;
  }, <CombatActionPrimitivesWithValues<number>>{});
}
export function applyCombatActionPrimitivesToResult(
  result: CombatActionResults,
  primitivesWithValues: CombatActionPrimitivesWithValues<number>,
): void
{
  Object.keys(primitivesWithValues).forEach(key =>
  {
    const {primitive, value} = primitivesWithValues[key]
    primitive.applyToResult(value, result);
  });
}
