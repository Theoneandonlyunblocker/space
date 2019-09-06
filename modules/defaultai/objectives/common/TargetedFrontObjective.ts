import {FleetAttackTarget} from "src/map/FleetAttackTarget";
import {Star} from "src/map/Star";
import {Unit} from "src/unit/Unit";
import {Front} from "../../mapai/Front";
import {MapEvaluator} from "../../mapai/MapEvaluator";
import {UnitEvaluator} from "../../mapai/UnitEvaluator";

import {FrontObjective} from "./FrontObjective";
import {Objective} from "./Objective";


// @ts-ignore 2417
export abstract class TargetedFrontObjective extends FrontObjective
{
  public readonly target: Star;
  public musterLocation: Star;

  protected hasMustered: boolean = false;

  protected constructor(
    score: number,
    target: Star,
    mapEvaluator: MapEvaluator,
    unitEvaluator: UnitEvaluator,
  )
  {
    super(score, mapEvaluator, unitEvaluator);
    this.target = target;
    this.musterLocation = mapEvaluator.player.getNearestOwnedStarTo(target);
  }

  protected static updateOngoingObjectivesList<T extends TargetedFrontObjective>(
    allOngoingObjectives: Objective[],
    createdObjectives: T[],
  ): Objective[]
  {
    return this.updateTargetedObjectives(allOngoingObjectives, createdObjectives);
  }

  public getRallyPoint(): Star
  {
    return this.hasMustered ? this.target : this.musterLocation;
  }

  protected evaluateDefaultUnitFit(
    unit: Unit,
    front: Front,
    lowHealthThreshhold: number = 0.75,
    healthAdjust: number = 1,
    distanceAdjust: number = 1,
  )
  {
    let score = 1;

    // penalize units on low health
    const healthPercentage = unit.currentHealth / unit.maxHealth;

    if (healthPercentage < lowHealthThreshhold)
    {
      score *= healthPercentage * healthAdjust;
    }

    // prioritize units closer to front target
    let turnsToReach = unit.getTurnsToReachStar(this.target);
    if (turnsToReach > 0)
    {
      turnsToReach *= distanceAdjust;
      const distanceMultiplier = 1 / (Math.log(turnsToReach + 2.5) / Math.log(2.5));
      score *= distanceMultiplier;
    }

    // prioritize if unit is already part of front
    if (this.front.hasUnit(unit))
    {
      score *= 1.2;
      if (this.hasMustered)
      {
        score *= 1.2;
      }
    }

    return score;
  }
  protected musterAndAttack(
    afterMoveCallback: () => void,
    targetFilter?: (target: FleetAttackTarget) => boolean,
  ): void
  {
    const moveTarget = this.getMoveTarget();
    const fleets = this.front.getAssociatedFleets();

    if (fleets.length <= 0)
    {
      afterMoveCallback();

      return;
    }

    const finishAllMoveFN = () =>
    {
      const unitsByLocation = this.front.getUnitsByLocation();
      const strengthAtTarget = this.unitEvaluator.evaluateCombatStrength(...unitsByLocation[this.target.id]);

      if (strengthAtTarget >= this.getMinimumRequiredCombatStrength())
      {
        const targetLocation = this.target;
        const player = this.mapEvaluator.player;

        const attackTargets = targetLocation.getTargetsForPlayer(player);

        const targetToAttack = targetFilter ?
          attackTargets.filter(targetFilter)[0] :
          attackTargets[0];

        if (!targetToAttack)
        {
          throw new Error("Targeted objective couldn't find target to attack.");
        }

        player.attackTarget(targetLocation, targetToAttack, afterMoveCallback);
      }
      else
      {
        afterMoveCallback();
      }
    };

    let finishedMovingCount = 0;
    const finishFleetMoveFN = () =>
    {
      finishedMovingCount++;
      if (finishedMovingCount >= fleets.length)
      {
        finishAllMoveFN();
      }
    };

    for (let i = 0; i < fleets.length; i++)
    {
      fleets[i].pathFind(moveTarget, undefined, finishFleetMoveFN);
    }
  }

  private getMoveTarget(): Star
  {
    let shouldMoveToTarget: boolean = false;

    const unitsByLocation = this.front.getUnitsByLocation();
    const fleets = this.front.getAssociatedFleets();

    if (this.hasMustered)
    {
      shouldMoveToTarget = true;
    }
    else
    {
      const minimumRequiredStrength = this.getMinimumRequiredCombatStrength();

      const strengthAtMuster = this.unitEvaluator.evaluateCombatStrength(...unitsByLocation[this.musterLocation.id]);
      if (strengthAtMuster >= minimumRequiredStrength)
      {
        this.hasMustered = true;
        shouldMoveToTarget = true;
      }
      else
      {
        const fleetsInRange = fleets.filter(fleet => fleet.hasEnoughMovePointsToMoveTo(this.target));
        const strengthInRange = fleetsInRange.map(fleet => fleet.units).reduce((total, units) =>
        {
          return total + this.unitEvaluator.evaluateCombatStrength(...units);
        }, 0);

        if (strengthInRange >= minimumRequiredStrength)
        {
          this.hasMustered = true;
          shouldMoveToTarget = true;
        }
      }
    }

    const moveTarget = shouldMoveToTarget ? this.target : this.musterLocation;

    return moveTarget;
  }
}
