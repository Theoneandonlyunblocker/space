/// <reference path="../data/templates/abilitytemplates.ts" />
/// <reference path="unit.ts"/>

module Rance
{
  export interface IMove
  {
    ability: Templates.AbilityTemplate;
    targetId: number;
  }
  export class MCTreeNode
  {
    battle: Battle;

    move: IMove;
    parent: MCTreeNode;
    children: MCTreeNode[] = [];

    visits: number = 0;
    totalScore: number = 0;

    possibleMoves: IMove[];

    constructor(battle: Battle, move?: IMove)
    {
      this.battle = battle;
      this.move = move;
    }

    getPossibleMoves()
    {
      if (!this.battle.activeUnit)
      {
        return null;
      }
      var targets = getTargetsForAllAbilities(this.battle, this.battle.activeUnit);

      var actions = [];

      for (var id in targets)
      {
        var unit = this.battle.unitsById[id];
        var targetActions = targets[id];
        for (var i = 0; i < targetActions.length; i++)
        {
          actions.push(
          {
            targetId: id,
            ability: targetActions[i]
          });
        }
      }

      return actions;
    }
    addChild()
    {
      if (!this.possibleMoves)
      {
        this.possibleMoves = this.getPossibleMoves();
      }

      var move = this.possibleMoves.pop();

      var battle = this.battle.makeVirtualClone();

      useAbility(battle, battle.activeUnit, move.ability,
        battle.unitsById[move.targetId]);

      battle.endTurn();
      
      var child = new MCTreeNode(battle, move);
      child.parent = this;
      this.children.push(child);

      return child;
    }
    updateResult(result: number)
    {
      this.visits++;
      this.totalScore += result;

      if (this.parent) this.parent.updateResult(result);
    }
    simulateOnce(battle: Battle)
    {
      var actions = getTargetsForAllAbilities(battle, battle.activeUnit);
      var targetId = getRandomKey(actions);
      var action = getRandomArrayItem(actions[targetId]);

      var target = battle.unitsById[targetId];

      useAbility(battle, battle.activeUnit, action, target);
      battle.endTurn();
    }
    simulateToEnd()
    {
      var battle = this.battle.makeVirtualClone();

      while (!battle.ended)
      {
        this.simulateOnce(battle);
      }

      this.updateResult(battle.getEvaluation());
    }
    getAverageResult()
    {
      return this.totalScore / this.visits;
    }
  }
}
