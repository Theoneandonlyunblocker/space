import {Fleet} from "../../../../../src/Fleet";
import Star from "../../../../../src/Star";

import {Front} from "../../../mapai/Front";

export default function moveTo(front: Front,
  afterMoveCallback: Function, getMoveTargetFN?: (fleet: Fleet) => Star)
{
  const fleets = front.getAssociatedFleets();

  if (fleets.length <= 0)
  {
    afterMoveCallback();
    return;
  }

  let finishedMovingCount = 0;
  const finishFleetMoveFN = function()
  {
    finishedMovingCount++;
    if (finishedMovingCount >= fleets.length)
    {
      afterMoveCallback();
    }
  };

  for (let i = 0; i < fleets.length; i++)
  {
    const moveTarget: Star = getMoveTargetFN ? getMoveTargetFN(fleets[i]) : front.objective.target;
    fleets[i].pathFind(moveTarget, null, finishFleetMoveFN);
  }
}
