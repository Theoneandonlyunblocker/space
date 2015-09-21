module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export module AIUtils
      {
        export function moveToRoutine(front: MapAI.Front,
          afterMoveCallback: Function, getMoveTargetFN?: (fleet: Fleet) => Star)
        {
          var fleets = front.getAssociatedFleets();

          if (fleets.length <= 0)
          {
            afterMoveCallback();
            return;
          }

          var finishedMovingCount = 0;
          var finishFleetMoveFN = function()
          {
            finishedMovingCount++;
            if (finishedMovingCount >= fleets.length)
            {
              afterMoveCallback();
            }
          };

          for (var i = 0; i < fleets.length; i++)
          {
            var moveTarget: Star = getMoveTargetFN ? getMoveTargetFN(fleets[i]) : front.objective.target;
            fleets[i].pathFind(moveTarget, null, finishFleetMoveFN);
          }
        }
      }
    }
  }
}
