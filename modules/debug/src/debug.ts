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
import { GameModuleInitializationPhase } from "core/src/modules/GameModuleInitializationPhase.js";
import { cssSources } from "../assets/assets.js";
import { loadCss } from "core/src/generic/utility.js";


export const debug: GameModule =
{
  info: moduleInfo,
  supportedLanguages: [englishLanguage],
  assetLoaders:
  {
    [GameModuleInitializationPhase.BattleStart]:
    [
      baseUrl =>
      {
        cssSources.forEach(source => loadCss(source, baseUrl));

        return Promise.resolve();
      },
    ],
  },
  addToModuleData: moduleData =>
  {
    moduleData.copyTemplates(
    {
      [nationalEpic.type]: nationalEpic,
      [thePyramids.type]: thePyramids,
    }, "buildings");
    moduleData.copyTemplates(
    {
      [debugShip.type]: debugShip,
    }, "units");
    moduleData.copyTemplates(
    {
      [debugItem.type]: debugItem,
    }, "items");
    moduleData.copyTemplates(
    {
      [debugAbility.key]: debugAbility,
    }, "combatAbilities");

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
