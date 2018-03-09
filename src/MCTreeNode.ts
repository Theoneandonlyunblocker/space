import AbilityTemplate from "./templateinterfaces/AbilityTemplate";

import Battle from "./Battle";
import {Move, MoveCollection} from "./Move";
import UnitBattleSide from "./UnitBattleSide";
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



export default class MCTreeNode
{
  // move that resulted in this action
  // TODO 2018.03.12 | check this is actually used properly. also maybe rename to clarify
  public readonly move: Move | null;
  public readonly depth: number = 0;

  public visits: number = 0;
  public winRate: number = 0;
  public averageScore: number = 0;
  public timesMoveWasPossible: number = 0;

  public get uctEvaluation(): number
  {
    return this._uctEvaluation;
  }


  private readonly sideId: UnitBattleSide;
  private readonly parent: MCTreeNode;
  private readonly isBetweenAI: boolean;

  private readonly children: MoveCollection<MCTreeNode>;

  private wins: number = 0;
  private totalScore: number = 0;

  private _uctEvaluation: number;
  private uctIsDirty: boolean = true;

  // battle represents state before associated move is played
  constructor(props:
  {
    sideId: UnitBattleSide,
    move: Move | null,
    depth: number,
    parent: MCTreeNode | null,
    isBetweenAI: boolean,
  })
  {
    this.sideId = props.sideId;
    this.move = props.move;
    this.depth = props.depth;
    this.parent = props.parent;
    this.isBetweenAI = props.isBetweenAI;

    this.children = new MoveCollection<MCTreeNode>();
  }

  public getChildForMove(move: Move): MCTreeNode | null
  {
    return this.children.get(move);
  }
  public getCombinedScore(): number
  {
    const sign = this.sideId === "side1" ? 1 : -1;

    const baseScore = this.averageScore * sign / 2;
    const winRate = this.winRate;
    const aiAdjust = this.move.ability.AIScoreAdjust || 0;

    return baseScore + winRate + aiAdjust;
  }
  public getAllChildren(): MCTreeNode[]
  {
    return this.children.flatten();
  }
  public simulateToEnd(battle: Battle): void
  {
    while (!battle.ended)
    {
      this.playRandomMove(battle);
    }

    this.updateResult(battle.getEvaluation());
  }
  public getBestNodeToSimulateFrom(battle: Battle): MCTreeNode
  {
    // terminal
    if (battle.ended)
    {
      return this;
    }

    const possibleMoves = this.getPossibleMoves(battle);
    const unexploredChildNodes: MCTreeNode[] = [];

    possibleMoves.forEach(move =>
    {
      let childForMove = this.getChildForMove(move);

      if (!childForMove)
      {
        childForMove = this.addChild(move, battle.activeUnit.battleStats.side);
      }

      if (childForMove.visits === 0)
      {
        unexploredChildNodes.push(childForMove);
      }

      childForMove.timesMoveWasPossible += 1;
    });

    // not fully expanded
    if (unexploredChildNodes.length > 0)
    {
      unexploredChildNodes.sort((a, b) =>
      {
        const aPriority = isFinite(a.move.ability.AIEvaluationPriority) ? a.move.ability.AIEvaluationPriority : 0;
        const bPriority = isFinite(b.move.ability.AIEvaluationPriority) ? b.move.ability.AIEvaluationPriority : 0;

        return bPriority - aPriority;
      });

      unexploredChildNodes[0].playAssociatedMove(battle);

      return unexploredChildNodes[0];
    }
    // expanded and not terminal, actually fetch child with highest score
    else if (this.children.length > 0)
    {
      const child = this.getHighestUctChild(possibleMoves);

      child.playAssociatedMove(battle);

      return child.getBestNodeToSimulateFrom(battle);
    }
    else
    {
      throw new Error("AI simulation couldn't find a move despite battle not having ended");
    }
  }

  private getPossibleMoves(battle: Battle): Move[]
  {
    if (!battle.activeUnit)
    {
      return [];
    }
    const targets = getTargetsForAllAbilities(battle, battle.activeUnit);

    const possibleMoves: Move[] = [];

    for (const id in targets)
    {
      const targetActions = targets[id];
      for (let i = 0; i < targetActions.length; i++)
      {
        if (targetActions[i].disableInAIBattles && this.isBetweenAI)
        {

        }
        else
        {
          possibleMoves.push(
          {
            userId: battle.activeUnit.id,
            targetId: parseInt(id),
            ability: targetActions[i],
          });
        }
      }
    }

    return possibleMoves;
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
  private pickRandomMoveFromPossibleActions(
    actions: {[targetId: number]: AbilityTemplate[]},
    userId: number,
  ): Move
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
          userId: userId,
          targetId: parseInt(targetId),
          ability: ability,
        };

        key++;
      });
    }

    const selectedKey = getRandomKeyWithWeights(prioritiesByKey);

    return movesByKey[selectedKey];
  }
  private playAssociatedMove(battle: Battle): void
  {
    const user = battle.unitsById[this.move.userId];
    const target = battle.unitsById[this.move.targetId];

    useAbility(battle, this.move.ability, user, target);
    battle.endTurn();
  }
  private playRandomMove(battle: Battle): void
  {
    const actions = getTargetsForAllAbilities(battle, battle.activeUnit);

    const selectedMove = this.pickRandomMoveFromPossibleActions(actions, battle.activeUnit.id);

    const ability = selectedMove.ability;
    const user = battle.unitsById[selectedMove.userId];
    const target = battle.unitsById[selectedMove.targetId];

    useAbility(battle, ability, user, target);
    battle.endTurn();
  }
  private addChild(move: Move, side: UnitBattleSide): MCTreeNode
  {
    const child = new MCTreeNode(
    {
      sideId: side,
      move: move,
      depth: this.depth + 1,
      parent: this,
      isBetweenAI: this.isBetweenAI,
    });

    this.children.set(move, child);

    return child;
  }
  private setUct(): void
  {
    if (!this.parent)
    {
      this._uctEvaluation = -1;
    }
    else
    {
      const explorationBias = 2;
      // TODO 2018.03.19 | tweak this. currently not based on anything
      const availabilityBias = 0.2;

      this._uctEvaluation = this.getCombinedScore() +
      Math.sqrt(explorationBias * Math.log(this.parent.visits) / this.visits) +
      // TODO 2018.03.19 | same here
      Math.sqrt(availabilityBias * (this.parent.visits / this.timesMoveWasPossible));

      if (isFinite(this.move.ability.AIEvaluationPriority))
      {
        this._uctEvaluation *= this.move.ability.AIEvaluationPriority;
      }
    }

    if (!isFinite(this.uctEvaluation))
    {
      debugger;
    }
    this.uctIsDirty = false;
  }
  private getHighestUctChild(possibleMoves: Move[]): MCTreeNode
  {
    const candidateChildren = possibleMoves.filter(move =>
    {
      return this.children.has(move);
    }).map(move =>
    {
      return this.children.get(move);
    });

    return candidateChildren.reduce((previousHighest, child) =>
    {
      if (child.uctIsDirty)
      {
        child.setUct();
      }

      if (!previousHighest || child.uctEvaluation > previousHighest.uctEvaluation)
      {
        return child;
      }
      else
      {
        return previousHighest;
      }
    }, null); // first child is skipped without initial value
  }
}
