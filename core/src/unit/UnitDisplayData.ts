import {GuardCoverage} from "./GuardCoverage";
import {UnitAttributesObject} from "./UnitAttributes";

export interface UnitDisplayData
{
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

  portraitSrc: string; // could also allow other portrait elements
  iconSrc: string; // could also allow other icon elements

  // in core/uicomponents/unit.ts:DisplayStatus
  // wasDestroyed?: boolean;
  // wasCaptured?: boolean;

  // isInBattlePrep?: boolean;
  // isActiveUnit?: boolean;
  // isHovered?: boolean;
  // isInPotentialTargetArea?: boolean;
  // isTargetOfActiveEffect?: boolean;
  // hoveredActionPointExpenditure?: number;
}
