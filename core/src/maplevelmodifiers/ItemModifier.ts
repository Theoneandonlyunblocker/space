import { PlayerModifier } from "./PlayerModifier";
import { GlobalModifier } from "./GlobalModifier";
import { UnitModifier } from "./UnitModifier";
import { ModifierTemplate } from "./ModifierTemplate";


type ItemModifierPropagations =
{
  owningPlayer?: PlayerModifier[];
  global?: GlobalModifier[];
  equippingUnit?: UnitModifier[];
};
export interface ItemModifier extends ModifierTemplate<ItemModifierPropagations>
{

}
