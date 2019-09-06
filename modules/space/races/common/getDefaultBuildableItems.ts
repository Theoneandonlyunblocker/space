import * as items from "modules/space/items/itemTemplates";
import {ItemTemplate} from "core/templateinterfaces/ItemTemplate";

export function getDefaultBuildableItems(): ItemTemplate[]
{
  return [
    items.bombLauncher1,
    items.bombLauncher2,
    items.afterBurner1,
    items.afterBurner2,
    items.shieldPlating1,
    items.shieldPlating2,
  ];
}
