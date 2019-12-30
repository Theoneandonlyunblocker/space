import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";
import {GameModule} from "core/src/modules/GameModule";

import * as moduleInfo from "../moduleInfo.json";
import { nationalEpic, thePyramids } from "./buildings";
import { debugShip } from "./units";
import { debugItem } from "./items";
import { uiScenes } from "./uiScenes";
import { debugAbility } from "./abilities";
import { addTitanChassisToModuleData } from "modules/titans/src/nonCoreModuleData";
import { debugChassis, debugChassis2 } from "./titanChassis";


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
    moduleData.copyTemplates(
    {
      [debugAbility.type]: debugAbility,
    }, "Abilities");

    for (const key in uiScenes)
    {
      moduleData.uiScenes[key] = uiScenes[key];
    }

    addTitanChassisToModuleData(moduleData,
    {
      [debugChassis.type]: debugChassis,
      [debugChassis2.type]: debugChassis2,
    });
  },
};
