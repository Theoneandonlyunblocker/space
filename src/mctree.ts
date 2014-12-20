/// <reference path="mctreenode.ts"/>
/// <reference path="battle.ts"/>

module Rance
{
  export class MCTree
  {
    rootNode: MCTreeNode;

    constructor(battle: Battle, sideId: string)
    {
      var cloned = battle.makeVirtualClone();
      this.rootNode = new MCTreeNode(cloned, sideId);
    }
    evaluate(iterations: number)
    {
      var root = this.rootNode;
      root.possibleMoves = root.getPossibleMoves();
      for (var i = 0; i < iterations; i++)
      {
        var bestUct: MCTreeNode;
        // select
        if (root.possibleMoves.length > 0)
        {
          bestUct = root;
        }
        else
        {
          bestUct = root.getRecursiveBestUctChild();
        }

        // expand if possible, else use selected
        var toSimulateFrom: MCTreeNode;

        if (!bestUct.possibleMoves)
        {
          bestUct.possibleMoves = bestUct.getPossibleMoves();
        }

        if (bestUct.possibleMoves.length > 0)
        {
          toSimulateFrom = bestUct.addChild();
        }
        else
        {
          toSimulateFrom = bestUct;
        }

        // simulate & backpropagate
        toSimulateFrom.simulateToEnd();
      }

      var sortedMoves = root.children.sort(root.sortByUctFN);

      var best = sortedMoves[0];

      console.log(best.move.ability.name, best.move.targetId);
    }
    printToConsole()
    {

    }
  }
}