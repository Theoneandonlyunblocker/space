import EffectActionTemplate from "./EffectActionTemplate";
import BattleSFXTemplate from "./BattleSFXTemplate";
import Unit from "../Unit";

declare interface AbilityEffectTemplate
{
  action: EffectActionTemplate;
  // should we pass the active battle as a parameter?
  trigger?: (user: Unit, target: Unit) => boolean;
  data?: any;
  // called after parent effect with same user and effect target
  // nesting these wont work and wouldnt do anything anyway
  attachedEffects?: AbilityEffectTemplate[];
  sfx?: BattleSFXTemplate;
}

export default AbilityEffectTemplate;
