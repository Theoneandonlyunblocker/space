import { PartialCoreScriptsWithData } from "../AllCoreScriptsWithData";


export const starScripts: PartialCoreScriptsWithData =
{
  onStarOwnerChange:
  {
    transferBuildingsFromOldOwner:
    {
      triggerPriority: -1,
      callback: (star, oldOwner, newOwner) =>
      {
        const oldOwnerBuildings = star.buildings.filter(building => building.controller === oldOwner);
        oldOwnerBuildings.forEach(building => building.setController(newOwner));
      },
    },
    destroyPerPlayerLimitedBuildings:
    {
      triggerPriority: 0,
      callback: (star, oldOwner, newOwner) =>
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
          building.handleDestroy();
          star.buildings.remove(building);
        });
      },
    },
  },
};
