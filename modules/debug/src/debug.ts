import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";
import {GameModule} from "core/src/modules/GameModule";

import * as moduleInfo from "../moduleInfo.json";
import { nationalEpic, thePyramids } from "./buildings";
import { debugShip } from "./units";
import { debugItem } from "./items";
import { uiScenes } from "./uiScenes";


export const debug: GameModule =
{
  info: moduleInfo,
  supportedLanguages: [englishLanguage],
  addToModuleData: moduleData =>
  {
    moduleData.copyTemplates(
    {
      [nationalEpic.type]: nationalEpic,
      [thePyramids.type]: thePyramids,
    }, "Buildings");
    moduleData.copyTemplates(
    {
      [debugShip.type]: debugShip,
    }, "Units");
    moduleData.copyTemplates(
    {
      [debugItem.type]: debugItem,
    }, "Items");

    for (const key in uiScenes)
    {
      moduleData.uiScenes[key] = uiScenes[key];
    }
  },
};
