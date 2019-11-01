import * as items from "modules/space/src/items/itemTemplates";
import {ItemTemplate} from "core/src/templateinterfaces/ItemTemplate";
import { options } from "core/src/app/Options";

export function getDefaultBuildableItems(): ItemTemplate[]
{
  const buildableItems = [
    items.bombLauncher1,
    items.bombLauncher2,
    items.afterBurner1,
    items.afterBurner2,
    items.shieldPlating1,
    items.shieldPlating2,
  ];

  if (options.debug.enabled)
  {
    buildableItems.push(items.debugItem);
  }

  return buildableItems;
}
