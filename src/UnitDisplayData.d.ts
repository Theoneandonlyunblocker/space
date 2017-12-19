import GuardCoverage from "./GuardCoverage";
import {PartialUnitAttributes} from "./UnitAttributes";
import UnitEffectTemplate from "./templateinterfaces/UnitEffectTemplate";

interface UnitDisplayData
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

  attributeChanges?: PartialUnitAttributes;
  passiveEffects?: UnitEffectTemplate[];

  portraitSrc: string; // could also allow other portrait elements
  iconSrc: string;
  // iconElement: React.ReactElement<any>;

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
