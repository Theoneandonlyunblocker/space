import BattleSFXTemplate from "./BattleSFXTemplate";
import
{
  AbilityEffectAction,
  ExecutedEffectsResult
} from "./AbilityEffectAction";

import Unit from "../Unit";
import Battle from "../Battle";
import
{
  GetUnitsInAreaFN
} from "../targeting";

declare interface AbilityEffectTemplate
{
  id: string;

  getUnitsInArea: GetUnitsInAreaFN;
  executeAction: AbilityEffectAction;

  // TODO | pass the active battle as a parameter
  // checked per target
  trigger?: (
    user: Unit,
    target: Unit,
    battle: Battle,
    executedEffectsResult: ExecutedEffectsResult
  ) => boolean;
  // called after parent effect with same user and effect target
  // nesting these wont work and wouldnt do anything anyway
  attachedEffects?: AbilityEffectTemplate[];
  sfx?: BattleSFXTemplate;
}

export default AbilityEffectTemplate;
