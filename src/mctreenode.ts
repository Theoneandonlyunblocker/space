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
    wins: number = 0;

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
      
      var child = new MCTreeNode(battle, move);
      child.parent = this;
      this.children.push(child);

      return child;
    }
  }
}
