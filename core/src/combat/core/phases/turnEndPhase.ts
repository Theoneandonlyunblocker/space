import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";


export function turnEndPhase(): CombatPhaseInfo<CorePhase>
{
  return {
    key: "turnEndPhase",
    defaultPhaseFinishCallback: (combatManager) =>
    {
      if (combatManager.battle.shouldEnd())
      {
        combatManager.setPhase("battleEndPhase");
      }
      else
      {
        combatManager.setPhase("turnStartPhase");
      }
    },
    combatActionFetchers:
    {
      // global effects
      // battle effects
      // unit effects
      //  items
      //  statuses
      //  passives
      // updateStatusEffects: (activeUnit, battle) =>
      // {
      //   // const statusEffectsWithTurnEndAction = ;
      //   // statusEffectsWithTurnEndAction.forEach(statusEffect => {});
      // }
    },
    combatListenerFetchers:
    {

    },
  };
}
