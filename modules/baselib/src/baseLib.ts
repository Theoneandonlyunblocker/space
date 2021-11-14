import * as PIXI from "pixi.js";

import {GameModule} from "core/src/modules/GameModule";
import {GameModuleInitializationPhase} from "core/src/modules/GameModuleInitializationPhase";

import
{
  setBaseUrl as setAssetsBaseUrl,
  assetSources,
  assetsToLoadIntoTextureCache,
} from "../assets/assets";
import * as moduleInfo from "../moduleInfo.json";
import { englishLanguage } from "modules/englishlanguage/src/englishLanguage";
import { combatAbilityTemplates } from "./combat/combatAbilityTemplates";
import { applyIntelligenceToHealing } from "./combat/actionListeners/applyIntelligenceToHealing";
import { allCoreCombatPhases } from "core/src/combat/core/coreCombatPhases";


export const baseLib: GameModule =
{
  info: moduleInfo,
  supportedLanguages: [englishLanguage],
  assetLoaders:
  {
    [GameModuleInitializationPhase.GameSetup]:
    [
      (baseUrl) =>
      {
        setAssetsBaseUrl(baseUrl);

        const loader = new PIXI.Loader(baseUrl);

        assetsToLoadIntoTextureCache.forEach(assetKey =>
        {
          loader.add(assetKey, assetSources[assetKey]);
        });

        return new Promise(resolve =>
        {
          loader.load(resolve);
        });
      },
    ]
  },
  addToModuleData: (moduleData) =>
  {
    moduleData.templates.combatAbilities.copyTemplates(combatAbilityTemplates);
    const actionListenerFetchers =
    {
      baseLibCombatActionListenerFetchers:
      {
        key: "baseLibCombatActionListenerFetchers",
        phasesToApplyTo: new Set(allCoreCombatPhases),
        fetch: () => [applyIntelligenceToHealing],
      }
    };
    moduleData.templates.combatActionListenerFetchers.copyTemplates(actionListenerFetchers);
  },
};
