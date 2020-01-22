import { CombatActionResults } from "./CombatActionResults";
import { FlatAndMultiplierAdjustment, PartialAdjustmentsObject, applyAdjustmentsObjects } from "../generic/FlatAndMultiplierAdjustment";


export interface CombatActionPrimitive<T>
{
  key: string;
  applyToResult: (value: T, result: CombatActionResults) => void;
}

export type CombatActionPrimitivesWithValues<T> =
{
  [key: string]:
  {
    primitive: CombatActionPrimitive<any>;
    value: T;
  };
};

export function resolveCombatActionPrimitiveAdjustments(
  ...allPrimitivesWithAdjustments: CombatActionPrimitivesWithValues<Partial<FlatAndMultiplierAdjustment>>[]
): CombatActionPrimitivesWithValues<number>
{
  const allPresentPrimitives: {[key: string]: CombatActionPrimitive<any>} = {};
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
