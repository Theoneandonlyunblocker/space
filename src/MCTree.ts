import Battle from "./Battle";
import
{
  default as MCTreeNode,
  Move,
} from "./MCTreeNode";

export default class MCTree
{
  rootNode: MCTreeNode;
  actualBattle: Battle;
  sideId: string;
  countVisitsAsIterations: boolean;

  constructor(battle: Battle, sideId: string, fastMode: boolean = false)
  {
    const cloned = battle.makeVirtualClone();
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
    let root = this.rootNode;
    if (!root.possibleMoves) root.possibleMoves = root.getPossibleMoves();

    if (this.rootSimulationNeedsToBeRemade())
    {
      this.remakeSimulation();
      root = this.rootNode;
    }

    const iterationStart = this.countVisitsAsIterations ? Math.min(iterations - 1, root.visits - root.depth) : 0;
    for (let i = iterationStart; i < iterations; i++)
    {
      // select & expand
      const toSimulateFrom = root.getRecursiveBestUctChild();


      // simulate & backpropagate
      toSimulateFrom.simulateToEnd();
    }

    const sortedMoves = root.children.sort(this.sortByCombinedScoreFN.bind(this));

    //this.printToConsole(sortedMoves);

    const best = sortedMoves[0];

    if (!best)
    {
      debugger;
    }

    return best;
  }
  getChildForMove(move: Move): MCTreeNode
  {
    return this.rootNode.getChildForMove(move);
  }
  rootSimulationNeedsToBeRemade(): boolean
  {
    const scoreVariationTolerance = 0.1;
    const scoreVariance = Math.abs(this.actualBattle.getEvaluation() - this.rootNode.currentScore);

    if (scoreVariance > scoreVariationTolerance)
    {
      return true;
    }
    else if (this.actualBattle.activeUnit !== this.rootNode.battle.activeUnit)
    {
      return true;
    }
    else if (this.rootNode.children.length === 0)
    {
      if (!this.rootNode.possibleMoves)
      {
        this.rootNode.possibleMoves = this.rootNode.getPossibleMoves();
      }

      if (this.rootNode.possibleMoves.length === 0)
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
  advanceMove(move: Move)
  {
    this.rootNode = this.getChildForMove(move);
    if (!this.rootNode)
    {
      this.remakeSimulation();
    }
  }
  getBestMoveAndAdvance(iterations: number): Move
  {
    const best = this.evaluate(iterations);
    this.rootNode = best;

    return best.move;
  }
  printToConsole(nodes: MCTreeNode[]): void
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
        currentScore: node.currentScore,
        averageScore: node.averageScore,
        finalScore: node.getCombinedScore(),
        abilityName: node.move.ability.displayName,
        targetId: node.move.targetId,
      };
      consoleRows.push(row);
    }
    const _ : any = window;

    if (_.console.table)
    {
      _.console.table(consoleRows);
    }

    console.log(nodes);
  }
}
