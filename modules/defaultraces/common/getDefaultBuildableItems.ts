import * as items from "../../defaultitems/itemTemplates";
import ItemTemplate from "../../../src/templateinterfaces/ItemTemplate";

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
