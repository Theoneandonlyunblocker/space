// TODO 2019.04.10 | unused, why?
import ModuleFile from "../../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../../src/ModuleFileInitializationPhase";

import * as battleSfxResources from "./resources";

import * as moduleInfo from "./moduleInfo.json";


export const spaceBattleSfx: ModuleFile =
{
  info: moduleInfo,
  phaseToInitializeBefore: ModuleFileInitializationPhase.BattleStart,
  supportedLanguages: "all",
  initialize: (baseUrl) =>
  {
    const loader = new PIXI.loaders.Loader(baseUrl);

    for (const key in battleSfxResources.toLoad)
    {
      loader.add(key, battleSfxResources.toLoad[key]);
    }

    return new Promise(resolve =>
    {
      loader.load(resolve);
    });
  },
};
