import {ScriptsWithData} from "../../../src/ModuleScriptData";

import {StarScripts} from "../../../src/modulescriptinterfaces/StarScripts";


export const starScripts: Partial<ScriptsWithData<StarScripts>> =
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
      }
    }
  ]
};
