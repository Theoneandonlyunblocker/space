import FleetAttackTarget from "../../../../../src/FleetAttackTarget";

import {Front} from "../../../mapai/Front";

export function independentTargetFilter(target: FleetAttackTarget)
{
  return target.enemy.isIndependent;
}
export function buildingControllerFilter(target: FleetAttackTarget)
{
  return target.building && target.enemy === target.building.controller;
}
export function musterAndAttack(
  front: Front,
  afterMoveCallback: () => void,
  targetFilter: (target: FleetAttackTarget) => boolean,
)
{
  let shouldMoveToTarget: boolean;

  let unitsByLocation = front.getUnitsByLocation();
  const fleets = front.getAssociatedFleets();

  const atMuster = unitsByLocation[front.musterLocation.id] ?
    unitsByLocation[front.musterLocation.id].length : 0;


  let inRangeOfTarget = 0;

  for (let i = 0; i < fleets.length; i++)
  {
    const distance = fleets[i].location.getDistanceToStar(front.targetLocation);
    if (fleets[i].getMinCurrentMovePoints() >= distance)
    {
      inRangeOfTarget += fleets[i].units.length;
    }
  }


  if (front.hasMustered)
  {
    shouldMoveToTarget = true;
  }
  else
  {

    if (atMuster >= front.minUnitsDesired || inRangeOfTarget >= front.minUnitsDesired)
    {
      front.hasMustered = true;
      shouldMoveToTarget = true;
    }
    else
    {
      shouldMoveToTarget = false;
    }

  }

  const moveTarget = shouldMoveToTarget ? front.targetLocation : front.musterLocation;


  const finishAllMoveFN = () =>
  {
    unitsByLocation = front.getUnitsByLocation();
    const atTarget = unitsByLocation[front.targetLocation.id] ?
      unitsByLocation[front.targetLocation.id].length : 0;

    if (atTarget >= front.minUnitsDesired)
    {
      const star = front.targetLocation;
      const player = front.units[0].fleet.player;

      const attackTargets = star.getTargetsForPlayer(player);

      const target = targetFilter ?
        attackTargets.filter(targetFilter)[0] :
        attackTargets[0];

      player.attackTarget(star, target, afterMoveCallback);
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
    fleets[i].pathFind(moveTarget, null, finishFleetMoveFN);
  }
}
