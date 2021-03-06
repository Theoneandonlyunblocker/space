import {CombatAbilityTemplate} from "../templateinterfaces/CombatAbilityTemplate";

import {Battle} from "../battle/Battle";
import {MCTree} from "./MCTree";
import {options} from "../app/Options";
import {Unit} from "../unit/Unit";
import
{
  useAbility,
} from "../abilities/battleAbilityUsage";


export class BattleSimulator
{
  battle: Battle;
  tree: MCTree;

  constructor(battle: Battle)
  {
    this.battle = battle;
    battle.isSimulated = true;

    if (!battle.ended)
    {
      this.tree = new MCTree(this.battle, this.battle.activeUnit.battleStats.side);
    }
  }

  simulateBattle()
  {
    while (!this.battle.ended)
    {
      this.simulateMove();
    }
  }
  simulateMove()
  {
    if (!this.battle.activeUnit || this.battle.ended)
    {
      throw new Error("Simulated battle already ended");
    }

    const rootVisitsUnderSimulationDepth = Math.min(
      options.debug.aiVsAiBattleSimulationDepth - this.tree.rootNode.visits,
      0,
    );

    const iterations = Math.max(
      rootVisitsUnderSimulationDepth,
      this.tree.rootNode.getPossibleMoves(this.battle).length * Math.log(options.debug.aiVsPlayerBattleSimulationDepth),
      options.debug.aiVsAiBattleSimulationDepth / 2,
    );

    const move = this.tree.getBestMoveAndAdvance(
      iterations,
      1.0,
    );
    const target = this.battle.unitsById[move.targetId];

    this.simulateAbility(move.ability, target);
    this.battle.endTurn();
  }
  simulateAbility(ability: CombatAbilityTemplate, target: Unit)
  {
    useAbility(this.battle, ability, this.battle.activeUnit, target);
  }
  finishBattle()
  {
    this.battle.finishBattle();
  }
}
