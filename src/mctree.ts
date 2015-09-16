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
    sortByCombinedScoreFN(a: MCTreeNode, b: MCTreeNode): number
    {
      if (a.sideId !== b.sideId) debugger;
      return b.getCombinedScore() - a.getCombinedScore();
    }
    evaluate(iterations: number): MCTreeNode
    {
      var root = this.rootNode;
      if (!root.possibleMoves) root.possibleMoves = root.getPossibleMoves();

      if (this.rootSimulationNeedsToBeRemade())
      {
        this.remakeSimulation();
        root = this.rootNode;
      }

      var iterationStart = this.countVisitsAsIterations ? Math.min(iterations - 1, root.visits - root.depth) : 0;
      for (var i = iterationStart; i < iterations; i++)
      {
        // select & expand
        var toSimulateFrom = root.getRecursiveBestUctChild();


        // simulate & backpropagate
        toSimulateFrom.simulateToEnd();
      }

      var sortedMoves = root.children.sort(this.sortByCombinedScoreFN.bind(this));

      //this.printToConsole(sortedMoves);

      var best = sortedMoves[0];
      return best;
    }
    getChildForMove(move: IMove): MCTreeNode
    {
      return this.rootNode.getChildForMove(move);
    }
    rootSimulationNeedsToBeRemade(): boolean
    {
      var scoreVariationTolerance = 0.1;
      var scoreVariance = Math.abs(this.actualBattle.getEvaluation() - this.rootNode.currentScore);
      if (scoreVariance > scoreVariationTolerance)
      {
        return true;
      }
      else if (this.actualBattle.activeUnit.id !== this.rootNode.battle.activeUnit.id)
      {
        return this.actualBattle.activeUnit.battleStats.side === this.sideId;
      }
      else if (this.rootNode.children.length === 0)
      {
        if (!this.rootNode.possibleMoves)
        {
          this.rootNode.possibleMoves = this.rootNode.getPossibleMoves();
        }
        
        if(this.rootNode.possibleMoves.length === 0)
        {
          return true;
        }
      }

      return false;
    }
    remakeSimulation()
    {
      this.rootNode = new MCTreeNode(this.actualBattle.makeVirtualClone());
      return this.rootNode;
    }
    advanceMove(move: IMove)
    {
      this.rootNode = this.getChildForMove(move);
      if (!this.rootNode)
      {
        this.remakeSimulation();
      }
    }
    getBestMoveAndAdvance(iterations: number): IMove
    {
      var best = this.evaluate(iterations);
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
          finalScore: node.getCombinedScore(),
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