import {englishLanguage} from "../englishlanguage/englishLanguage";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../src/ModuleFileInitializationPhase";

import BattleSceneTester from "../../src/uicomponents/BattleSceneTester";
import FlagMaker from "../../src/uicomponents/FlagMaker";
import BattleComponentFactory from "../../src/uicomponents/battle/Battle";
import BattlePrepComponentFactory from "../../src/uicomponents/battleprep/BattlePrep";
import GalaxyMap from "../../src/uicomponents/galaxymap/GalaxyMap";
import SetupGame from "../../src/uicomponents/setupgame/SetupGame";
import SfxEditor from "../../_temp_sfxEditor/sfxeditor/SfxEditor";

import * as moduleInfo from "./moduleInfo.json";


const defaultUi: ModuleFile =
{
  info: moduleInfo,
  phaseToInitializeBefore: ModuleFileInitializationPhase.GameStart,
  supportedLanguages: [englishLanguage],
  addToModuleData: (moduleData) =>
  {
    // TODO 2019.05.26 | add ui scenes

    return moduleData;
    },
};

export default defaultUi;
