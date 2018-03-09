import Battle from "./Battle";
import MCTreeNode from "./MCTreeNode";
import {Move} from "./Move";


export default class MCTree
{
  private rootNode: MCTreeNode;
  private readonly battle: Battle;
  private readonly countVisitsAsIterations: boolean;

  constructor(battle: Battle, sideId: string, fastMode: boolean = false)
  {
    this.battle = battle;

    this.remakeRootNode();

    if (fastMode)
    {
      this.countVisitsAsIterations = true;
    }
  }

  private static sortByCombinedScoreFN(a: MCTreeNode, b: MCTreeNode): number
  {
    return b.getCombinedScore() - a.getCombinedScore();
  }
  private static printChoicesToConsole(nodes: MCTreeNode[]): void
  {
    const consoleRows: any[] = [];

    for (let i = 0; i < nodes.length; i++)
    {
      const node = nodes[i];
      const row =
      {
        visits: node.visits,
        uctEvaluation: node.uctEvaluation,
        winRate: node.winRate,
        averageScore: node.averageScore,
        finalScore: node.getCombinedScore(),
        timesMoveWasPossible: node.timesMoveWasPossible,
        move: `${node.move.userId}: ${node.move.ability.displayName} => ${node.move.targetId}`,
      };
      consoleRows.push(row);
    }

    if (console.table)
    {
      console.table(consoleRows);
    }
  }

  public advanceMove(move: Move)
  {
    this.rootNode = this.getChildForMove(move);
    if (!this.rootNode)
    {
      this.remakeRootNode();
    }
  }
  public getBestMoveAndAdvance(iterations: number): Move
  {
    const best = this.evaluate(iterations);
    this.rootNode = best;

    return best.move;
  }

  private evaluate(iterations: number): MCTreeNode
  {
    let root = this.rootNode;
    // if (!root.possibleMoves)
    // {
    //   root.possibleMoves = root.getPossibleMoves();
    // }

    // if (this.rootNodeNeedsToBeRemade())
    // {
    //   this.remakeRootNode();
    //   root = this.rootNode;
    // }

    const iterationStart = this.countVisitsAsIterations ? Math.min(iterations - 1, root.visits - root.depth) : 0;
    for (let i = iterationStart; i < iterations; i++)
    {
      const battle = this.battle.makeVirtualClone();

      // select & expand
      const toSimulateFrom = root.getBestNodeToSimulateFrom(battle);

      // simulate & backpropagate
      toSimulateFrom.simulateToEnd(battle);
    }

    const sortedMoves = root.getAllChildren().sort(MCTree.sortByCombinedScoreFN);

    MCTree.printChoicesToConsole(sortedMoves);

    const best = sortedMoves[0];

    return best;
  }
  private getChildForMove(move: Move): MCTreeNode
  {
    return this.rootNode.getChildForMove(move);
  }
  // private rootNodeNeedsToBeRemade(): boolean
  // {
  //   const scoreVariationTolerance = 0.1;
  //   const scoreVariance = Math.abs(this.actualBattle.getEvaluation() - this.rootNode.currentScore);

  //   if (scoreVariance > scoreVariationTolerance)
  //   {
  //     return true;
  //   }
  //   else if (this.actualBattle.activeUnit !== this.rootNode.battle.activeUnit)
  //   {
  //     return true;
  //   }
  //   else if (this.rootNode.children.length === 0)
  //   {
  //     if (this.rootNode.getUnexploredMoves().length === 0)
  //     {
  //       return true;
  //     }
  //   }

  //   return false;
  // }
  private remakeRootNode()
  {
    this.rootNode = new MCTreeNode(
    {
      sideId: this.battle.activeUnit.battleStats.side,
      move: null,
      depth: 0,
      parent: null,
      isBetweenAI: this.battle.side1Player.isAI && this.battle.side2Player.isAI,
    });
  }
}
