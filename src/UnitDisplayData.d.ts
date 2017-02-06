import GuardCoverage from "./GuardCoverage";
import {PartialUnitAttributes} from "./UnitAttributes";
import UnitPassiveEffect from "./templateinterfaces/UnitPassiveEffect";

interface UnitDisplayData
{
  facesLeft: boolean;
  name: string;

  currentHealth: number;
  maxHealth: number;
  guardAmount: number;
  guardType: GuardCoverage;
  currentActionPoints: number;
  maxActionPoints: number;
  isPreparing: boolean;
  isAnnihilated: boolean;
  isSquadron: boolean;

  attributeChanges?: PartialUnitAttributes;
  passiveEffects?: UnitPassiveEffect[];

  portraitSrc: string; // TODO fluff | allow other portrait elements
  iconSrc: string;
  // iconElement: React.ReactElement<any>; // TODO fluff | allow other icon elements

  // in src/uicomponents/unit.ts:DisplayStatus
  // wasDestroyed?: boolean;
  // wasCaptured?: boolean;

  // isInBattlePrep?: boolean;
  // isActiveUnit?: boolean;
  // isHovered?: boolean;
  // isInPotentialTargetArea?: boolean;
  // isTargetOfActiveEffect?: boolean;
  // hoveredActionPointExpenditure?: number;
}

export default UnitDisplayData;
