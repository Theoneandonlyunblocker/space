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
    moduleData.templates.buildings.copyTemplates(
    {
      [nationalEpic.key]: nationalEpic,
      [thePyramids.key]: thePyramids,
    });
    moduleData.templates.units.copyTemplates(
    {
      [debugShip.key]: debugShip,
    });
    moduleData.templates.items.copyTemplates(
    {
      [debugItem.key]: debugItem,
    });
    moduleData.templates.combatAbilities.copyTemplates(
    {
      [debugAbility.key]: debugAbility,
    });

    for (const key in uiScenes)
    {
      moduleData.uiScenes[key] = uiScenes[key];
    }

    addTitanChassisToModuleData(moduleData,
    {
      [debugChassis.key]: debugChassis,
      [debugChassis2.key]: debugChassis2,
    });
  },
};
