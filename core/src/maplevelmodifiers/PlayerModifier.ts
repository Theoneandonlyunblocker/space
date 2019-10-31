import { StarModifier } from "./StarModifier";
import { UnitModifier } from "./UnitModifier";
import { ModifierTemplate } from "./ModifierTemplate";
import { FlatAndMultiplierAdjustment, getBaseAdjustment } from "../generic/FlatAndMultiplierAdjustment";
import { Player } from "../player/Player";
import { PartialMapLevelModifier, MapLevelModifier } from "./MapLevelModifiers";


type PlayerModifierPropagations =
{
  ownedStars?: StarModifier[];
  ownedUnits?: UnitModifier[];
};
export type PlayerModifierAdjustments =
{
  researchPoints: FlatAndMultiplierAdjustment;
};
export interface PlayerModifier extends ModifierTemplate<PlayerModifierPropagations>
{
  filter?: (player: Player) => boolean;
  self?: PartialMapLevelModifier<PlayerModifierAdjustments>;
}
export function getBasePlayerSelfModifier(): MapLevelModifier<PlayerModifierAdjustments>
{
  return {
    adjustments:
    {
      researchPoints: getBaseAdjustment(),
    },
    income: {},
    flags: new Set(),
  };
}
