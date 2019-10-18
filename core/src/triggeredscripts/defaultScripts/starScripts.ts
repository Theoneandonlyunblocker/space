import { PartialTriggeredScriptsWithData } from "../TriggeredScripts";


export const starScripts: PartialTriggeredScriptsWithData =
{
  star:
  {
    onOwnerChange:
    {
      transferBuildingsFromOldOwner:
      {
        triggerPriority: -1,
        script: (star, oldOwner, newOwner) =>
        {
          const oldOwnerBuildings = star.buildings.filter(building => building.controller === oldOwner);
          oldOwnerBuildings.forEach(building => building.setController(newOwner));
        },
      },
      destroyPerPlayerLimitedBuildings:
      {
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
    },
  },
};
