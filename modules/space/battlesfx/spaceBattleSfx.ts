// TODO 2019.04.10 | unused, why?
import {GameModule} from "../../../src/GameModule";
import {GameModuleInitializationPhase} from "../../../src/GameModuleInitializationPhase";

import * as battleSfxResources from "./resources";
import * as BattleSfxTemplates from  "./templates/battleSfx";

import * as moduleInfo from "./moduleInfo.json";


export const spaceBattleSfx: GameModule =
{
  info: moduleInfo,
  phaseToInitializeBefore: GameModuleInitializationPhase.BattleStart,
  supportedLanguages: "all",
  initialize: (baseUrl) =>
  {
    const loader = new PIXI.Loader(baseUrl);

    for (const key in battleSfxResources.toLoad)
    {
      loader.add(key, battleSfxResources.toLoad[key]);
    }

    return new Promise(resolve =>
    {
      loader.load(resolve);
    });
  },
  addToModuleData: (moduleData) =>
  {
    moduleData.copyTemplates(BattleSfxTemplates, "BattleSfx");
  }
};
