import { MapLevelModifiersCollection } from "./MapLevelModifiersCollection";
import { ModifierTemplate } from "./ModifierTemplate";
import { Modifier } from "./Modifier";


export type PropagationTypes<T extends ModifierTemplate<any>> = keyof T["propagations"];

export type MapLevelModifiersPropagation<Source extends ModifierTemplate<any>, Target extends Source["propagations"][PropagationTypes<Source>]> =
{
  modifier: Modifier<Target>;
  target: MapLevelModifiersCollection<Target>;
};

export type SimpleMapLevelModifiersPropagation<Source extends ModifierTemplate<any>, Target extends Source["propagations"][PropagationTypes<Source>] = any> =
  Omit<MapLevelModifiersPropagation<Source, Target>, "modifier"> &
  {
    template: Target;
  };
