import { MapLevelModifiersCollection } from "./MapLevelModifiersCollection";
import { Modifier } from "./Modifier";


export type PropagationTypes<T extends Modifier> = Exclude<keyof T, "filter" | "self">;

export type MapLevelModifiersPropagation<T extends Modifier, P extends T[PropagationTypes<T>] = T[PropagationTypes<T>]> =
{
  modifier: P;
  modifierId: number;
  targetType: PropagationTypes<T>;
  target: MapLevelModifiersCollection<P>;
};
export type MapLevelModifiersPropagationWithoutId<T extends Modifier, P extends T[PropagationTypes<T>] = T[PropagationTypes<T>]> =
  Omit<MapLevelModifiersPropagation<T, P>, "modifierId">;
