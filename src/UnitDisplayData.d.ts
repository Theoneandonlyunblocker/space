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
  isDestroyed: boolean;
  isCaptured: boolean;
  
  portraitSrc: string;
  iconSrc: string;
  
  
  hoveredActionPointsExpenditure: number;
}

export default UnitDisplayData;