import {AbilityTemplate} from "../templateinterfaces/AbilityTemplate";

import {Battle} from "../battle/Battle";
import {Move, MoveCollection} from "./Move";
import {UnitBattleSide} from "../unit/UnitBattleSide";
import
{
  getTargetsForAllAbilities,
} from "../abilities/battleAbilityTargeting";
import
{
  useAbility,
} from "../abilities/battleAbilityUsage";
import
{
  getRandomKeyWithWeights,
  linearStep,
} from "../generic/utility";


export class MCTreeNode
{
  // move that resulted in this action
  public readonly move: Move | null;
  public children: MoveCollection<MCTreeNode>;

  public visits: number = 0;

  private wins: number = 0;
  private totalEndScore: number = 0;
  private timesMoveWasPossible: number = 0;

  private depth: number = 0;
  private readonly sideId: UnitBattleSide;
  private readonly parent: MCTreeNode;
  private readonly isBetweenAi: boolean;

  private evaluationWeight: number;
  private evaluationWeightIsDirty: boolean = true;


  constructor(props:
  {
    sideId: UnitBattleSide;
    move: Move | null;
    depth: number;
    parent: MCTreeNode | null;
    isBetweenAi: boolean;
  })
  {
    this.sideId = props.sideId;
    this.move = props.move;
    this.depth = props.depth;
    this.parent = props.parent;
    this.isBetweenAi = props.isBetweenAi;

    this.children = new MoveCollection<MCTreeNode>();
  }

  public getCombinedScore(): number // 0...1
  {
    const winRateWeight = 1;
    const endScoreWeight = 0.5;

    const sign = this.sideId === "side1" ? 1 : -1;

    const averageEndScore = this.totalEndScore / this.visits;
    const baseEndScore = averageEndScore * sign; // -1...1
    const normalizedEndScore = (baseEndScore + 1) / 2; // 0...1
    const winRate = this.wins / this.visits;
    const aiAdjust = this.move.ability.AiScoreMultiplier || 1;

    const combinedScore = (normalizedEndScore * endScoreWeight + winRate * winRateWeight) * aiAdjust;
    const normalizedCombinedScore = combinedScore / (winRateWeight + endScoreWeight);

    return normalizedCombinedScore;
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
      let childForMove = this.children.get(move);

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
        const aPriority = isFinite(a.move.ability.AiEvaluationPriority) ? a.move.ability.AiEvaluationPriority : 0;
        const bPriority = isFinite(b.move.ability.AiEvaluationPriority) ? b.move.ability.AiEvaluationPriority : 0;

        return bPriority - aPriority;
      });

      unexploredChildNodes[0].playAssociatedMove(battle);

      return unexploredChildNodes[0];
    }
    // expanded and not terminal, actually fetch child with highest evaluation weight
    else if (this.children.length > 0)
    {
      const child = this.getHighestEvaluationWeightChild(possibleMoves);

      child.playAssociatedMove(battle);

      return child.getBestNodeToSimulateFrom(battle);
    }
    else
    {
      throw new Error("AI simulation couldn't find a move despite battle not having ended");
    }
  }
  public recursivelyAdjustConfidence(confidencePersistence: number): void
  {
    this.depth = this.depth - 1;
    this.evaluationWeightIsDirty = true;

    if (confidencePersistence === 1)
    {
      return;
    }
    else
    {
      this.visits *= confidencePersistence;
      this.timesMoveWasPossible *= confidencePersistence;
      this.wins *= confidencePersistence;
      this.totalEndScore *= confidencePersistence;

      if (confidencePersistence === 0)
      {
        this.children = new MoveCollection<MCTreeNode>();
      }
      else
      {
        this.children.forEach(child =>
        {
          child.recursivelyAdjustConfidence(confidencePersistence);
        });
      }
    }
  }
  public getPossibleMoves(battle: Battle): Move[]
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
        if (targetActions[i].disableInAiBattles && this.isBetweenAi)
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
  public getDebugInformation()
  {
    return(
    {
      combinedScore: this.getCombinedScore(),
      visits: this.visits,
      evaluationWeight: this.evaluationWeight,
      winRate: this.wins / this.visits,
      averageEndScore: this.totalEndScore / this.visits,
      timesMoveWasPossible: this.timesMoveWasPossible,
      move: `${this.move.userId}: ${this.move.ability.displayName} => ${this.move.targetId}`,
    });
  }

  private updateResult(result: number): void
  {
    this.visits++;
    this.totalEndScore += result;

    if (this.sideId === "side1")
    {
      if (result > 0)
      {
        this.wins++;
      }
    }
    else if (this.sideId === "side2")
    {
      if (result < 0)
      {
        this.wins++;
      }
    }

    this.evaluationWeightIsDirty = true;

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
        const priority = isFinite(ability.AiEvaluationPriority) ? ability.AiEvaluationPriority : 1;

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
      isBetweenAi: this.isBetweenAi,
    });

    this.children.set(move, child);

    return child;
  }
  private setEvaluationWeight(): void
  {
    // TODO 2018.03.19 | tweak these. currently not based on much anything
    const explorationBias = 2;
    const availabilityBias = 0.2;

    // if victory seems certain, put less weight on exploring strictly optimal moves
    // should help with both exploiting and avoiding blunders
    const winRate = this.wins / this.visits;
    const decidedness = Math.pow(linearStep(winRate, 0.925, 1.0), 3) / 2;

    this.evaluationWeight = this.getCombinedScore() * (1 - decidedness) +
      Math.sqrt(explorationBias * Math.log(this.parent.visits) / this.visits) +
      availabilityBias * (this.parent.visits / this.timesMoveWasPossible);

    if (isFinite(this.move.ability.AiEvaluationPriority))
    {
      this.evaluationWeight *= this.move.ability.AiEvaluationPriority;
    }

    this.evaluationWeightIsDirty = false;
  }
  private getHighestEvaluationWeightChild(possibleMoves: Move[]): MCTreeNode
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
      if (child.evaluationWeightIsDirty)
      {
        child.setEvaluationWeight();
      }

      if (!previousHighest || child.evaluationWeight > previousHighest.evaluationWeight)
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
