import { PartialTriggeredScriptsWithData } from "../TriggeredScripts";


export const starScripts: PartialTriggeredScriptsWithData =
{
  star:
  {
    onOwnerChange:
    [
      {
        key: "destroyPerPlayerLimitedBuildings",
        triggerPriority: 0,
        script: (star, oldOwner, newOwner) =>
        {
          star.buildings.filter((building) =>
          {
            return isFinite(building.template.maxBuiltForPlayer) ||
              building.template.families.some(family =>
              {
                return isFinite(family.maxBuiltForPlayer);
              });
          }).forEach(building =>
          {
            star.buildings.remove(building);
          });
        },
      },
    ],
  },
};
