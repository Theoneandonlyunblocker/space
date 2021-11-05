import {GuardCoverage} from "./GuardCoverage";
import {UnitAttributesObject} from "./UnitAttributes";
import { CombatEffect } from "../combat/CombatEffect";

export interface UnitDisplayData
{
  // TODO 2021.11.03 | change to isFacingRight for clarity & consistency with vfx
  facesLeft: boolean;
  name: string;

  currentHealth: number;
  maxHealth: number;
  guardAmount: number;
  guardType: GuardCoverage | null;
  currentActionPoints: number;
  maxActionPoints: number;
  isPreparing: boolean;
  isAnnihilated: boolean;
  isSquadron: boolean;

  attributeChanges?: Partial<UnitAttributesObject>;
  // TODO 2021.11.03 | does this trigger react updates?
  combatEffects: CombatEffect[];

  portraitSrc: string; // could also allow other portrait elements
  iconSrc: string; // could also allow other icon elements

  // in modules/defaultui/src/uicomponents/unit/unit.ts:DisplayStatus
  // wasDestroyed?: boolean;
  // wasCaptured?: boolean;

  // isInBattlePrep?: boolean;
  // isActiveUnit?: boolean;
  // isHovered?: boolean;
  // isInPotentialTargetArea?: boolean;
  // isTargetOfActiveEffect?: boolean;
  // hoveredActionPointExpenditure?: number;
}
