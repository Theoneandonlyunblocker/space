import { MapLevelModifiersCollection } from "./MapLevelModifiersCollection";
import { Modifier } from "./Modifier";


export type PropagationTypes<T extends Modifier<any>> = keyof T["propagations"];

export type MapLevelModifiersPropagation<Source extends Modifier<any>, Target extends Source["propagations"][PropagationTypes<Source>]> =
{
  modifier: Target;
  modifierId: number;
  targetType: PropagationTypes<Source>;
  target: MapLevelModifiersCollection<Target>;
};

export type MapLevelModifiersPropagationWithoutId<T extends Modifier<any>> = Omit<MapLevelModifiersPropagation<T, any>, "modifierId">;
