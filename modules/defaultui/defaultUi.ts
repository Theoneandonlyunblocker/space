import * as PIXI from "pixi.js";

import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {GameModule} from "core/modules/GameModule";
import {GameModuleInitializationPhase} from "core/modules/GameModuleInitializationPhase";
import
{
  cachedAssets,
  setBaseUrl as setAssetBaseUrl,
} from "./assets";

import {BattleSceneTester} from "./uicomponents/BattleSceneTester";
import {FlagMaker} from "./uicomponents/FlagMaker";
import {Battle} from "./uicomponents/battle/Battle";
import {BattlePrep} from "./uicomponents/battleprep/BattlePrep";
import {GalaxyMap} from "./uicomponents/galaxymap/GalaxyMap";
import {SetupGame} from "./uicomponents/setupgame/SetupGame";
import {SaveRecoveryWithDetails} from "./uicomponents/errors/SaveRecoveryWithDetails";
import {TopLevelErrorBoundary} from "./uicomponents/errors/TopLevelErrorBoundary";
import {VfxEditor} from "./uicomponents/vfxeditor/VfxEditor";

import * as moduleInfo from "./moduleInfo.json";


function loadCss(url: string, baseUrl: string): void
{
  const link = document.createElement("link");
  link.href = new URL(url, baseUrl).toString();
  link.type = "text/css";
  link.rel = "stylesheet";

  document.getElementsByTagName("head")[0].appendChild(link);
}

export const defaultUi: GameModule =
{
  info: moduleInfo,
  phaseToInitializeBefore: GameModuleInitializationPhase.AppInit,
  supportedLanguages: [englishLanguage],
  initialize: (baseUrl) =>
  {
    loadCss("./css/main.css", baseUrl);
    setAssetBaseUrl(baseUrl);

    const loader = new PIXI.Loader(baseUrl);

    const battleSceneFlagFadeUrl = "./img/battleSceneFlagFade.svg";
    loader.add(
    {
      url: battleSceneFlagFadeUrl,
      loadType: 1, // XML
    });

    return new Promise(resolve =>
    {
      loader.load(() =>
      {
        const response = <XMLDocument> loader.resources[battleSceneFlagFadeUrl].data;
        const svgDoc = <SVGElement> response.children[0];
        cachedAssets.battleSceneFlagFade = svgDoc;

        resolve();
      });
    });
  },
  addToModuleData: (moduleData) =>
  {
    moduleData.uiScenes.battle = Battle;
    moduleData.uiScenes.battlePrep = BattlePrep;
    moduleData.uiScenes.galaxyMap = GalaxyMap;
    moduleData.uiScenes.setupGame = SetupGame;
    moduleData.uiScenes.errorRecovery = SaveRecoveryWithDetails;
    moduleData.uiScenes.topLevelErrorBoundary = TopLevelErrorBoundary;
    moduleData.uiScenes.flagMaker = FlagMaker;
    moduleData.uiScenes.vfxEditor = VfxEditor;
    moduleData.uiScenes.battleSceneTester = BattleSceneTester;

    return moduleData;
  },
};
