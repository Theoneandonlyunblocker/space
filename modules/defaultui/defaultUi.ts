import * as PIXI from "pixi.js";

import {englishLanguage} from "../englishlanguage/englishLanguage";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../src/ModuleFileInitializationPhase";
import {svgCache} from "../../src/svgCache";

import BattleSceneTester from "./uicomponents/BattleSceneTester";
import FlagMaker from "./uicomponents/FlagMaker";
import BattleComponentFactory from "./uicomponents/battle/Battle";
import BattlePrepComponentFactory from "./uicomponents/battleprep/BattlePrep";
import GalaxyMap from "./uicomponents/galaxymap/GalaxyMap";
import SetupGame from "./uicomponents/setupgame/SetupGame";
import {SaveRecoveryWithDetails} from "./uicomponents/errors/SaveRecoveryWithDetails";
import {TopLevelErrorBoundary} from "./uicomponents/errors/TopLevelErrorBoundary";
import SfxEditor from "./uicomponents/sfxeditor/SfxEditor";

import * as moduleInfo from "./moduleInfo.json";


export const defaultUi: ModuleFile =
{
  info: moduleInfo,
  phaseToInitializeBefore: ModuleFileInitializationPhase.AppInit,
  supportedLanguages: [englishLanguage],
  initialize: (baseUrl) =>
  {
    const loader = new PIXI.loaders.Loader(baseUrl);

    const battleSceneFlagFadeUrl = "img/battleSceneFlagFade.svg";
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
        svgCache.battleSceneFlagFade = svgDoc;

        resolve();
      });
    });
  },
  addToModuleData: (moduleData) =>
  {
    moduleData.uiScenes.battle = BattleComponentFactory;
    moduleData.uiScenes.battlePrep = BattlePrepComponentFactory;
    moduleData.uiScenes.galaxyMap = GalaxyMap;
    moduleData.uiScenes.setupGame = SetupGame;
    moduleData.uiScenes.errorRecovery = SaveRecoveryWithDetails;
    moduleData.uiScenes.topLevelErrorBoundary = TopLevelErrorBoundary;
    moduleData.uiScenes.flagMaker = FlagMaker;
    moduleData.uiScenes.sfxEditor = SfxEditor;
    moduleData.uiScenes.battleSceneTester = BattleSceneTester;

    return moduleData;
  },
};
