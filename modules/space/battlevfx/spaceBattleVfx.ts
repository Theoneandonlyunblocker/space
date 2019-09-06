import {GameModule} from "core/modules/GameModule";
import {GameModuleInitializationPhase} from "core/modules/GameModuleInitializationPhase";

import * as battleVfxResources from "./resources";
import * as BattleVfxTemplates from  "./templates/battleVfx";

import * as moduleInfo from "./moduleInfo.json";


export const spaceBattleVfx: GameModule =
{
  info: moduleInfo,
  phaseToInitializeBefore: GameModuleInitializationPhase.BattleStart,
  supportedLanguages: "all",
  initialize: (baseUrl) =>
  {
    const loader = new PIXI.Loader(baseUrl);

    for (const key in battleVfxResources.toLoad)
    {
      loader.add(key, battleVfxResources.toLoad[key]);
    }

    return new Promise(resolve =>
    {
      loader.load(resolve);
    });
  },
  addToModuleData: (moduleData) =>
  {
    moduleData.copyTemplates(BattleVfxTemplates, "BattleVfx");
  }
};
