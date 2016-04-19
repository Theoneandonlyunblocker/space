import GuardCoverage from "./GuardCoverage";
import Unit from "./Unit";

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
  
  portraitSrc: string; // TODO fluff | allow other portrait elements
  iconSrc: string;
  // iconElement: React.ReactElement<any>; // TODO fluff | allow other icon elements
  
  wasDestroyed?: boolean;
  wasCaptured?: boolean;
  
  isInBattlePrep?: boolean;
  isActiveUnit?: boolean;
  isHovered?: boolean;
  isInPotentialTargetArea?: boolean;
  isTargetOfActiveEffect?: boolean;
  hoveredActionPointExpenditure?: number;
}

export default UnitDisplayData;
