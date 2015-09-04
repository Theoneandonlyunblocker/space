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
    sortByWinRateFN(a: MCTreeNode, b: MCTreeNode)
    {
      return b.winRate - a.winRate;
    }
    sortByScoreFN(a: MCTreeNode, b: MCTreeNode)
    {
      return b.averageScore - a.averageScore;
    }
    evaluate(iterations: number)
    {
      var root = this.rootNode;
      root.possibleMoves = root.getPossibleMoves();
      for (var i = 0; i < iterations; i++)
      {

        // select & expand
        var toSimulateFrom = root.getRecursiveBestUctChild();


        // simulate & backpropagate
        toSimulateFrom.simulateToEnd();
      }

      var sortedMoves = root.children.sort(this.sortByWinRateFN);

      // this.printToConsole(sortedMoves);

      var best = sortedMoves[0];
      return best;
    }
    printToConsole(nodes: MCTreeNode[])
    {
      var consoleRows: any[] = [];
      for (var i = 0; i < nodes.length; i++)
      {
        var node = nodes[i];
        var row =
        {
          visits: node.visits,
          uctEvaluation: node.uctEvaluation,
          winRate: node.winRate,
          currentScore: node.currentScore,
          averageScore: node.averageScore,
          abilityName: node.move.ability.displayName,
          targetId: node.move.targetId
        }
        consoleRows.push(row);
      }
      var _ : any = window;

      if (_.console.table)
      {
        _.console.table(consoleRows);
      }

      console.log(nodes);
    }
  }
}