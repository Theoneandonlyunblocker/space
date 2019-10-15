import { MapLevelModifiersCollection } from "./MapLevelModifiersCollection";
import { Modifiers } from "./Modifiers";


export type PropagationTypes<T extends Modifiers> = Exclude<keyof T, "filter" | "self">;

export type MapLevelModifiersPropagation<T extends Modifiers, P extends T[PropagationTypes<T>] = T[PropagationTypes<T>]> =
{
  modifier: P;
  modifierId: number;
  targetType: PropagationTypes<T>;
  target: MapLevelModifiersCollection<P>;
};
export type MapLevelModifiersPropagationWithoutId<T extends Modifiers, P extends T[PropagationTypes<T>] = T[PropagationTypes<T>]> =
  Omit<MapLevelModifiersPropagation<T, P>, "modifierId">;
