import Battle from "./Battle";
import MCTreeNode from "./MCTreeNode";
import {Move} from "./Move";
import Options from "./Options";


export default class MCTree
{
  public get rootNode(): MCTreeNode
  {
    return this._rootNode;
  }

  private _rootNode: MCTreeNode;
  private readonly battle: Battle;

  constructor(battle: Battle, sideId: string)
  {
    this.battle = battle;

    this.remakeRootNode();
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
        finalScore: node.getCombinedScore(),
        visits: node.visits,
        evaluationWeight: node.evaluationWeight,
        winRate: node.wins / node.visits,
        averageScore: node.totalScore / node.visits,
        timesMoveWasPossible: node.timesMoveWasPossible,
        move: `${node.move.userId}: ${node.move.ability.displayName} => ${node.move.targetId}`,
      };
      consoleRows.push(row);
    }

    if (Options.debug.enabled && console.table)
    {
      console.table(consoleRows);
    }
  }

  public advanceMove(move: Move, confidencePersistence: number)
  {
    this._rootNode = this._rootNode.children.get(move);
    if (!this._rootNode)
    {
      this.remakeRootNode();
    }

    this._rootNode.recursivelyAdjustConfidence(confidencePersistence);
  }
  public getBestMoveAndAdvance(iterations: number, confidencePersistence: number): Move
  {
    const best = this.getBestMove(iterations);

    this.advanceMove(best.move, confidencePersistence);

    return best.move;
  }

  private getBestMove(iterations: number): MCTreeNode
  {
    for (let i = 0; i < iterations; i++)
    {
      const battle = this.battle.makeVirtualClone();

      // select & expand
      const toSimulateFrom = this._rootNode.getBestNodeToSimulateFrom(battle);

      // simulate & backpropagate
      toSimulateFrom.simulateToEnd(battle);
    }

    const sortedMoves = this._rootNode.children.flatten().sort(MCTree.sortByCombinedScoreFN);

    MCTree.printChoicesToConsole(sortedMoves);

    const best = sortedMoves[0];

    return best;
  }
  private remakeRootNode()
  {
    this._rootNode = new MCTreeNode(
    {
      sideId: this.battle.activeUnit.battleStats.side,
      move: null,
      depth: 0,
      parent: null,
      isBetweenAI: this.battle.side1Player.isAI && this.battle.side2Player.isAI,
    });
  }
}
