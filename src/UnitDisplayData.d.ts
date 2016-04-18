import GuardCoverage from "./GuardCoverage";
import Unit from "./Unit";

interface UnitDisplayData
{
  unit: Unit;
  
  currentHealth: number;
  maxHealth: number;
  
  guardAmount: number;
  guardType: GuardCoverage;
  
  currentActionPoints: number;
  maxActionPoints: number;

  isPreparing: boolean;
  isAnnihilated: boolean;
  
  portraitSrc: string;
  iconSrc: string;
  
  isDestroyed?: boolean;
  isCaptured?: boolean;
  
  hoveredActionPointsExpenditure?: number;
}

export default UnitDisplayData;