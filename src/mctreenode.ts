/// <reference path="../data/templates/abilitytemplates.ts" />
/// <reference path="unit.ts"/>

module Rance
{
  export interface IMove
  {
    ability: Templates.AbilityTemplate;
    target: Unit;
  }
  export class MCTreeNode
  {
    battle: Battle;

    move: IMove;
    parent: MCTreeNode;
    children: MCTreeNode[] = [];

    visits: number = 0;
    wins: number = 0;

    possibleChildren: IMove[];

    constructor(battle: Battle, move: IMove)
    {
      this.battle = battle;
    }

    setPossibleChildren()
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
            target: unit,
            ability: targetActions[i]
          });
        }
      }

      this.possibleChildren = actions;
    }
    addChild()
    {
      if (!this.possibleChildren) this.setPossibleChildren();

      var child = this.possibleChildren.pop();
      this.children.push()

      return child;
    }
  }
}
