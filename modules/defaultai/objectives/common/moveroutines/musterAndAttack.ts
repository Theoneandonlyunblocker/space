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
export default function musterAndAttack(targetFilter: (target: FleetAttackTarget) => boolean,
  front: Front, afterMoveCallback: () => void)
{
  var shouldMoveToTarget: boolean;

  var unitsByLocation = front.getUnitsByLocation();
  var fleets = front.getAssociatedFleets();

  var atMuster = unitsByLocation[front.musterLocation.id] ?
    unitsByLocation[front.musterLocation.id].length : 0;


  var inRangeOfTarget = 0;

  for (let i = 0; i < fleets.length; i++)
  {
    var distance = fleets[i].location.getDistanceToStar(front.targetLocation);
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

  var moveTarget = shouldMoveToTarget ? front.targetLocation : front.musterLocation;


  var finishAllMoveFN = function()
  {
    unitsByLocation = front.getUnitsByLocation();
    var atTarget = unitsByLocation[front.targetLocation.id] ?
      unitsByLocation[front.targetLocation.id].length : 0;

    if (atTarget >= front.minUnitsDesired)
    {
      var star = front.targetLocation;
      var player = front.units[0].fleet.player;

      var attackTargets = star.getTargetsForPlayer(player);

      const target = targetFilter ?
        attackTargets.filter(targetFilter)[0] :
        attackTargets[0];

      player.attackTarget(star, target, afterMoveCallback);
    }
    else
    {
      afterMoveCallback();
    }
  }

  var finishedMovingCount = 0;
  var finishFleetMoveFN = function()
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