
import AbilityTemplate from "./templateinterfaces/AbilityTemplate";

import Battle from "./Battle";
import
{
  getTargetsForAllAbilities,
} from "./battleAbilityTargeting";
import
{
  useAbility,
} from "./battleAbilityUsage";
import
{
  getRandomKeyWithWeights,
} from "./utility";


export interface Move
{
  ability: AbilityTemplate;
  targetId: number;
}
export default class MCTreeNode
{
  public readonly battle: Battle;
  public readonly sideId: string;
  public readonly move: Move | null;
  public readonly depth: number = 0;

  public visits: number = 0;
  public winRate: number = 0;
  public averageScore: number = 0;
  public currentScore: number;

  public readonly children: MCTreeNode[] = [];
  // TODO 2018.03.09 | ??? we have getPossibleMoves
  public possibleMoves: Move[];

  public uctEvaluation: number;


  private readonly parent: MCTreeNode;
  private readonly isBetweenAI: boolean;

  private wins: number = 0;
  private totalScore: number = 0;

  private uctIsDirty: boolean = true;

  constructor(battle: Battle, move: Move | null, depth: number, parent: MCTreeNode | null)
  {
    this.battle = battle;
    this.sideId = battle.activeUnit.battleStats.side;
    this.move = move;
    this.depth = depth;
    this.parent = parent;
    this.isBetweenAI = battle.side1Player.isAI && battle.side2Player.isAI;

    this.currentScore = battle.getEvaluation();
  }

  public getPossibleMoves(): Move[]
  {
    if (!this.battle.activeUnit)
    {
      return [];
    }
    const targets = getTargetsForAllAbilities(this.battle, this.battle.activeUnit);

    const actions: Move[] = [];

    for (const id in targets)
    {
      const targetActions = targets[id];
      for (let i = 0; i < targetActions.length; i++)
      {
        if (!this.isBetweenAI || !targetActions[i].disableInAIBattles)
        {
          actions.push(
          {
            targetId: parseInt(id),
            ability: targetActions[i],
          });
        }
      }
    }

    return actions;
  }
  public getChildForMove(move: Move): MCTreeNode
  {
    for (let i = 0; i < this.children.length; i++)
    {
      const child = this.children[i];
      if (child.move.targetId === move.targetId &&
        child.move.ability.type === move.ability.type)
      {
        return child;
      }
    }

    if (!this.possibleMoves)
    {
      this.possibleMoves = this.getPossibleMoves();
    }

    for (let i = 0; i < this.possibleMoves.length; i++)
    {
      const possibleMove = this.possibleMoves[i];
      if (possibleMove.targetId === move.targetId &&
        possibleMove.ability.type === move.ability.type)
      {
        return this.addChild(i);
      }
    }

    return null;
  }
  public simulateToEnd(): void
  {
    const battle = this.battle.makeVirtualClone();

    while (!battle.ended)
    {
      this.simulateOnce(battle);
    }

    this.updateResult(battle.getEvaluation());
  }
  public getCombinedScore(): number
  {
    const sign = this.sideId === "side1" ? 1 : -1;

    const baseScore = this.averageScore * sign / 2;
    const winRate = this.winRate;
    const aiAdjust = this.move.ability.AIScoreAdjust || 0;

    return (baseScore + winRate) + aiAdjust * 1.5;
  }
  public getRecursiveBestUctChild(): MCTreeNode
  {
    // terminal
    if (this.battle.ended)
    {
      return this;
    }

    if (!this.possibleMoves)
    {
      this.possibleMoves = this.getPossibleMoves();
    }

    // not fully expanded
    if (this.possibleMoves && this.possibleMoves.length > 0)
    {
      return this.addChild();
    }
    // only 1 choice
    else if (this.children.length === 1)
    {
      return this.children[0];
    }
    // expanded and not terminal, actually fetch child with highest score
    else if (this.children.length > 1)
    {
      return this.getHighestUctChild().getRecursiveBestUctChild();
    }
    else
    {
      throw new Error("MCTreeNode has no children despite battle not having ended");
    }
  }

  private updateResult(result: number): void
  {
    this.visits++;
    this.totalScore += result;

    if (this.sideId === "side1")
    {
      if (result > 0)
      {
        this.wins++;
      }
    }
    if (this.sideId === "side2")
    {
      if (result < 0)
      {
        this.wins++;
      }
    }

    this.averageScore = this.totalScore / this.visits;
    this.winRate = this.wins / this.visits;
    this.uctIsDirty = true;

    if (this.parent)
    {
      this.parent.updateResult(result);
    }
  }
  private pickRandomMoveFromPossibleActions(actions: {[targetId: number]: AbilityTemplate[]}): Move
  {
    let key = 0;

    const prioritiesByKey:
    {
      [key: number]: number;
    } = {};
    const movesByKey:
    {
      [key: number]: Move;
    } = {};

    for (const targetId in actions)
    {
      const abilities = actions[targetId];
      abilities.forEach(ability =>
      {
        const priority = isFinite(ability.AIEvaluationPriority) ? ability.AIEvaluationPriority : 1;

        prioritiesByKey[key] = priority;
        movesByKey[key] =
        {
          targetId: parseInt(targetId),
          ability: ability,
        };

        key++;
      });
    }

    const selectedKey = getRandomKeyWithWeights(prioritiesByKey);

    return movesByKey[selectedKey];
  }
  private simulateOnce(battle: Battle): void
  {
    const actions = getTargetsForAllAbilities(battle, battle.activeUnit);

    const selectedMove = this.pickRandomMoveFromPossibleActions(actions);

    const ability = selectedMove.ability;
    const target = battle.unitsById[selectedMove.targetId];

    useAbility(battle, ability, battle.activeUnit, target);
    battle.endTurn();
  }
  private addChild(possibleMovesIndex?: number): MCTreeNode
  {
    if (!this.possibleMoves)
    {
      this.possibleMoves = this.getPossibleMoves();
    }

    let move: Move;

    if (isFinite(possibleMovesIndex))
    {
      move = this.possibleMoves.splice(possibleMovesIndex, 1)[0];
    }
    else
    {
      move = this.possibleMoves.pop();
    }

    const battle = this.battle.makeVirtualClone();

    const child = new MCTreeNode(battle, move, this.depth + 1, this);
    this.children.push(child);

    useAbility(battle, move.ability, battle.activeUnit, battle.unitsById[move.targetId]);

    child.currentScore = battle.getEvaluation();

    battle.endTurn();

    return child;
  }
  private setUct(): void
  {
    if (!this.parent)
    {
      this.uctEvaluation = -1;
      this.uctIsDirty = false;

      return;
    }

    this.uctEvaluation = this.getCombinedScore() + Math.sqrt(2 * Math.log(this.parent.visits) / this.visits);
    if (isFinite(this.move.ability.AIEvaluationPriority))
    {
      this.uctEvaluation *= this.move.ability.AIEvaluationPriority;
    }

    this.uctIsDirty = false;
  }
  private getHighestUctChild(): MCTreeNode
  {
    let highest = this.children[0];
    for (let i = 0; i < this.children.length; i++)
    {
      const child = this.children[i];
      if (child.uctIsDirty)
      {
        child.setUct();
      }

      if (child.uctEvaluation > highest.uctEvaluation)
      {
        highest = child;
      }
    }

    return highest;
  }
}
