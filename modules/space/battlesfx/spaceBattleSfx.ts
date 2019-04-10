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
    const loader = new PIXI.loaders.Loader();

    for (const key in battleSfxResources.toLoad)
    {
      const url = baseUrl + battleSfxResources.toLoad[key];

      loader.add(key, url);
    }

    return new Promise(resolve =>
    {
      loader.load(resolve);
    });
  },
};
