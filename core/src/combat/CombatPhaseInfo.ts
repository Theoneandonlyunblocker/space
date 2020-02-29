import { CombatPhaseFinishCallback } from "./CombatPhaseFinishCallback";
import { CombatActionFetcher, CombatActionListenerFetcher } from "./CombatActionFetcher";


export interface CombatPhaseInfo<AllPhases extends string>
{
  key: string;

  defaultPhaseFinishCallback: CombatPhaseFinishCallback<AllPhases>;

  /**
   * f.ex would fetch takePoisonDamage action if unit has poisoned status effect
   */
  combatActionFetchers:
  {
    [key: string]: CombatActionFetcher;
  };

  /**
   * f.ex would fetch reduceTakenPoisonDamage modifier if unit has an item with poison resist equipped
   */
  combatListenerFetchers:
  {
    [key: string]: CombatActionListenerFetcher<AllPhases>;
  };
}
