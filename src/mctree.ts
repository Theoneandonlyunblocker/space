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

      var best = sortedMoves[0];

      var consoleRows = [];
      for (var i = 0; i < sortedMoves.length; i++)
      {
        var node = sortedMoves[i];
        var row =
        {
          visits: node.visits,
          uctEvaluation: node.uctEvaluation,
          winRate: node.winRate,
          averageScore: node.averageScore,
          abilityName: node.move.ability.name,
          targetId: node.move.targetId
        }
        consoleRows.push(row);
      }
      console.table(consoleRows);

      console.log(sortedMoves);
    }
    printToConsole()
    {

    }
  }
}