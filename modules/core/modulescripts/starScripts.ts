import { PartialModuleScriptsWithData } from "src/modules/ModuleScripts";


export const starScripts: PartialModuleScriptsWithData =
{
  star:
  {
    onOwnerChange:
    [
      {
        key: "destroyPerPlayerLimitedBuildings",
        priority: 0,
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
