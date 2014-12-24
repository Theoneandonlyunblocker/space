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
    depth: number = 0;
    parent: MCTreeNode;
    children: MCTreeNode[] = [];

    visits: number = 0;
    wins: number = 0;
    winRate: number = 0;
    totalScore: number = 0;
    averageScore: number = 0;
    currentScore: number;

    possibleMoves: IMove[];

    uctEvaluation: number;
    uctIsDirty: boolean = true;

    constructor(battle: Battle, sideId: string, move?: IMove)
    {
      this.battle = battle;
      this.sideId = sideId;
      this.move = move;

      this.currentScore = battle.getEvaluation();
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
      child.depth = this.depth + 1;
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
      this.winRate = this.wins / this.visits;
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
    setUct()
    {
      if (!parent)
      {
        this.uctEvaluation = -1;
        this.uctIsDirty = false;
        return;
      }

      this.uctEvaluation = this.wins / this.visits +
        Math.sqrt(2 * Math.log(this.parent.visits) / this.visits);

      this.uctIsDirty = false;
    }
    getHighestUctChild()
    {
      var highest = this.children[0];
      for (var i = 0; i < this.children.length; i++)
      {
        var child = this.children[i];
        if (child.uctIsDirty)
        {
          child.setUct();
        }

        if (child.uctEvaluation > highest.uctEvaluation)
        {
          highest = child;
        }
      }

      return highest;
    }
    getRecursiveBestUctChild()
    {
      if (!this.possibleMoves)
      {
        this.possibleMoves = this.getPossibleMoves();
      }

      // not fully expanded
      if (this.possibleMoves && this.possibleMoves.length > 0)
      {
        return this.addChild();
      }
      // expanded and not terminal
      else if (this.children.length > 0)
      {
        return this.getHighestUctChild().getRecursiveBestUctChild();
      }
      // terminal
      else
      {
        return this;
      }
    }
  }
}
