/// <reference path="mctreenode.ts"/>
/// <reference path="battle.ts"/>

module Rance
{
  export class MCTree
  {
    rootNode: MCTreeNode;
    actualBattle: Battle;
    sideId: string;
    countVisitsAsIterations: boolean;

    constructor(battle: Battle, sideId: string, fastMode: boolean = false)
    {
      var cloned = battle.makeVirtualClone();
      this.rootNode = new MCTreeNode(cloned);

      this.actualBattle = battle;
      this.sideId = sideId;
      if (fastMode)
      {
        this.countVisitsAsIterations = true;
      }
    }
    sortByWinRateFN(a: MCTreeNode, b: MCTreeNode): number
    {
      return b.winRate - a.winRate;
    }
    sortByScoreFN(a: MCTreeNode, b: MCTreeNode): number
    {
      if (a.sideId !== b.sideId) debugger;
      var sign = a.sideId === "side1" ? 1 : -1;

      return(
        (b.currentScore + b.averageScore) * sign + (b.move.ability.AIScoreAdjust || 0) -
        (a.currentScore + a.averageScore) * sign + (a.move.ability.AIScoreAdjust || 0)
      );
    }
    evaluate(iterations: number): MCTreeNode
    {
      var root = this.rootNode;
      if (!root.possibleMoves) root.possibleMoves = root.getPossibleMoves();

      if (this.rootSimulationNeedsToBeRemade())
      {
        root = this.rootNode = new MCTreeNode(this.actualBattle.makeVirtualClone());
      }
      var iterationStart = this.countVisitsAsIterations ? Math.min(iterations - 1, root.visits - root.depth) : 0;
      for (var i = iterationStart; i < iterations; i++)
      {
        // select & expand
        var toSimulateFrom = root.getRecursiveBestUctChild();


        // simulate & backpropagate
        toSimulateFrom.simulateToEnd();
      }

      var sortedMoves = root.children.sort(this.sortByScoreFN);

      this.printToConsole(sortedMoves);

      var best = sortedMoves[0];
      return best;
    }
    getChildForMove(move: IMove): MCTreeNode
    {
      return this.rootNode.getChildForMove(move);
    }
    rootSimulationNeedsToBeRemade(): boolean
    {
      var scoreVariationTolerance = 0.2;
      var scoreVariance = Math.abs(this.actualBattle.getEvaluation() - this.rootNode.currentScore);
      console.log("scoreVariance", scoreVariance);
      console.log("visits", this.rootNode.visits);
      if ( scoreVariance > scoreVariationTolerance)
      {
        console.log("remade scoreVariance");
        return true;
      }
      else if (this.rootNode.children.length === 0 && this.rootNode.possibleMoves.length === 0)
      {
        return true;
      }

      return false;
    }
    advanceMove(move: IMove)
    {
      console.log("advance", move.targetId, move.ability.type);
      this.rootNode = this.getChildForMove(move);
    }
    getBestMoveAndAdvance(iterations: number): IMove
    {
      var best = this.evaluate(iterations);
      console.log("getBestMoveAndAdvance", best.move.targetId, best.move.ability.type);
      this.rootNode = best;

      return best.move;
    }
    printToConsole(nodes: MCTreeNode[]): void
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