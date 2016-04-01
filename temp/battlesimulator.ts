/// <reference path="battle.ts"/>
/// <reference path="mctree.ts"/>

export class BattleSimulator
{
  battle: Battle;
  tree: MCTree;
  hasEnded: boolean = false;

  constructor(battle: Battle)
  {
    this.battle = battle;
    battle.isSimulated = true;

    if (!battle.ended)
    {
      this.tree = new MCTree(this.battle, this.battle.activeUnit.battleStats.side, true);
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

    var move = this.tree.getBestMoveAndAdvance(Options.debugOptions.battleSimulationDepth);
    var target = this.battle.unitsById[move.targetId];

    this.simulateAbility(move.ability, target);
    
    this.battle.endTurn();
  }

  simulateAbility(ability: Templates.IAbilityTemplate, target: Unit)
  {
    useAbility(this.battle, ability, this.battle.activeUnit, target, false);
  }

  getBattleEndData()
  {
    if (!this.battle.ended)
    {
      throw new Error("Simulated battle hasn't ended yet");
    }

    var captured = this.battle.capturedUnits;
    var destroyed = this.battle.deadUnits;
    var victor = this.battle.getVictor();
  }
  finishBattle()
  {
    this.battle.finishBattle();
  }
}
