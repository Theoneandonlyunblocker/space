import { CombatPhase } from "./CombatPhase";
import { CombatPhaseInfo } from "./CombatPhaseInfo";



export class CombatManager
{
  public currentPhase: CombatPhase;

  constructor()
  {

  }

  public setPhase(phaseInfo: CombatPhaseInfo): void
  {
    this.currentPhase = new CombatPhase(phaseInfo);
  }
}
