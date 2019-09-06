import {Battle} from "../battle/Battle";
import {MCTreeNode} from "./MCTreeNode";
import {Move} from "./Move";
import * as debug from "../app/debug";


export class MCTree
{
  public get rootNode(): MCTreeNode
  {
    return this._rootNode;
  }

  private _rootNode: MCTreeNode;
  private readonly battle: Battle;
  private readonly isBetweenAi: boolean;

  constructor(battle: Battle, sideId: string)
  {
    this.battle = battle;
    this.isBetweenAi = battle.side1Player.isAi && battle.side2Player.isAi;

    this.remakeRootNode();
  }

  private static sortByCombinedScoreFN(a: MCTreeNode, b: MCTreeNode): number
  {
    return b.getCombinedScore() - a.getCombinedScore();
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

    if (!this.isBetweenAi && debug.shouldLog("ai"))
    {
      debug.table("ai", "AI move evaluation", sortedMoves.map(node => node.getDebugInformation()));
    }

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
      isBetweenAi: this.isBetweenAi,
    });
  }
}
