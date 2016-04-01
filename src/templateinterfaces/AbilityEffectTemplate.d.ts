import EffectActionTemplate from "./EffectActionTemplate.d.ts";
import BattleSFXTemplate from "./BattleSFXTemplate.d.ts";
import Unit from "../Unit.ts";

declare interface AbilityEffectTemplate
{
  action: EffectActionTemplate;
  // TODO | pass battle parameter?
  trigger?: (user: Unit, target: Unit) => boolean;
  data?: any;
  // called after parent effect with same user and effect target
  // nesting these wont work and wouldnt do anything anyway
  attachedEffects?: AbilityEffectTemplate[];
  sfx?: BattleSFXTemplate;
}

export default AbilityEffectTemplate;
