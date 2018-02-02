
import {activeModuleData} from "./activeModuleData";
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
  battle: Battle;
  sideId: string;
  isBetweenAI: boolean;

  move: Move;
  depth: number = 0;
  parent: MCTreeNode;
  children: MCTreeNode[] = [];

  visits: number = 0;
  wins: number = 0;
  winRate: number = 0;
  totalScore: number = 0;
  averageScore: number = 0;
  currentScore: number;

  possibleMoves: Move[];

  uctEvaluation: number;
  uctIsDirty: boolean = true;

  constructor(battle: Battle, move?: Move)
  {
    this.battle = battle;
    this.sideId = battle.activeUnit.battleStats.side;
    this.move = move;
    this.isBetweenAI = battle.side1Player.isAI && battle.side2Player.isAI;

    this.currentScore = battle.getEvaluation();
  }

  getPossibleMoves(): Move[]
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
  addChild(possibleMovesIndex?: number): MCTreeNode
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

    const child = new MCTreeNode(battle, move);
    child.parent = this;
    child.depth = this.depth + 1;
    this.children.push(child);

    useAbility(battle, move.ability, battle.activeUnit, battle.unitsById[move.targetId]);

    child.currentScore = battle.getEvaluation();

    battle.endTurn();

    return child;
  }
  getChildForMove(move: Move): MCTreeNode
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
    // const currId = this.battle.activeUnit.id;
    // throw new Error("Tried to fetch child node for impossible move " +
    //   currId + ": " + move.ability.type + " -> " + move.targetId);
  }
  updateResult(result: number): void
  {
    this.visits++;
    this.totalScore += result;

    if (this.sideId === "side1")
    {
      if (result > 0) this.wins++;
    }
    if (this.sideId === "side2")
    {
      if (result < 0) this.wins++;
    }

    this.averageScore = this.totalScore / this.visits;
    this.winRate = this.wins / this.visits;
    this.uctIsDirty = true;

    if (this.parent) this.parent.updateResult(result);
  }
  private pickRandomMove(actions: {[targetId: number]: AbilityTemplate[]}): Move
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
  simulateOnce(battle: Battle): void
  {
    const actions = getTargetsForAllAbilities(battle, battle.activeUnit);

    const selectedMove = this.pickRandomMove(actions);

    const ability = selectedMove.ability;
    const target = battle.unitsById[selectedMove.targetId];

    useAbility(battle, ability, battle.activeUnit, target);
    battle.endTurn();
  }
  simulateToEnd(): void
  {
    const battle = this.battle.makeVirtualClone();

    while (!battle.ended)
    {
      this.simulateOnce(battle);
    }

    this.updateResult(battle.getEvaluation());
  }
  clearResult(): void
  {
    this.visits = 0;
    this.wins = 0;
    this.averageScore = 0;
    this.totalScore = 0;
  }
  getCombinedScore(): number
  {
    const sign = this.sideId === "side1" ? 1 : -1;

    const baseScore = this.averageScore * sign / 2;
    const winRate = this.winRate;
    const aiAdjust = this.move.ability.AIScoreAdjust || 0;

    return (baseScore + winRate) + aiAdjust * 1.5;
  }
  setUct(): void
  {
    if (!this.parent)
    {
      this.uctEvaluation = -1;
      this.uctIsDirty = false;
      return;
    }

    //this.uctEvaluation = this.winRate + Math.sqrt(2 * Math.log(this.parent.visits) / this.visits);
    this.uctEvaluation = this.getCombinedScore() + Math.sqrt(2 * Math.log(this.parent.visits) / this.visits);
    if (this.move.ability.AIEvaluationPriority)
    {
      this.uctEvaluation *= this.move.ability.AIEvaluationPriority;
    }

    this.uctIsDirty = false;
  }
  getHighestUctChild(): MCTreeNode
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
  getRecursiveBestUctChild(): MCTreeNode
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
}
