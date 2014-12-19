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
    sideId: string;

    move: IMove;
    parent: MCTreeNode;
    children: MCTreeNode[] = [];

    visits: number = 0;
    wins: number = 0;
    totalScore: number = 0;
    averageScore: number = 0;

    possibleMoves: IMove[];

    uctEvaluation: number;
    uctIsDirty: boolean = true;

    constructor(battle: Battle, sideId: string, move?: IMove)
    {
      this.battle = battle;
      this.sideId = sideId;
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
      
      var child = new MCTreeNode(battle, this.sideId, move);
      child.parent = this;
      this.children.push(child);

      return child;
    }
    updateResult(result: number)
    {
      this.visits++;
      this.totalScore += result;

      if (this.sideId === "side1")
      {
        if (result < 0) this.wins++;
      }
      if (this.sideId === "side2")
      {
        if (result > 0) this.wins++;
      }

      this.averageScore = this.totalScore / this.visits;
      this.uctIsDirty = true;

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
    clearResult()
    {
      this.visits = 0;
      this.wins = 0;
      this.averageScore = 0;
      this.totalScore = 0;
    }
    setUctForChildren()
    {
      for (var i = 0; i < this.children.length; i++)
      {
        var child = this.children[i];
        if (!child.uctIsDirty) continue;

        child.uctEvaluation = child.wins / child.visits +
          Math.sqrt(2 * Math.log(this.visits) / child.visits);

        child.uctIsDirty = false;
      }
    }
    sortByUctFN(a: MCTreeNode, b: MCTreeNode)
    {
      return a.uctEvaluation - b.uctEvaluation;
    }
    getBestUctChild()
    {
      debugger;
      this.setUctForChildren();
      var sorted = this.children.sort(this.sortByUctFN);

      return sorted[0];
    }
  }
}
