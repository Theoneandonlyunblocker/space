import {Fleet} from "core/src/fleets/Fleet";
import {Star} from "core/src/map/Star";

import {Front} from "../../../mapai/Front";


export function moveToTarget(
  front: Front,
  afterDoneCallback: () => void,
  getMoveTarget: (fleet: Fleet) => Star,
): void
{
  const fleets = front.getAssociatedFleets();

  if (fleets.length <= 0)
  {
    afterDoneCallback();

    return;
  }

  let finishedMovingCount = 0;
  const afterFleetMoveCallback = () =>
  {
    finishedMovingCount++;
    if (finishedMovingCount >= fleets.length)
    {
      afterDoneCallback();
    }
  };

  fleets.forEach(fleet =>
  {
    const moveTarget = getMoveTarget(fleet);
    fleet.pathFind(moveTarget, undefined, afterFleetMoveCallback);
  });
}
