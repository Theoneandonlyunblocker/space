import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {ModuleData} from "src/modules/ModuleData";
import {GameModule} from "src/modules/GameModule";
import {GameModuleInitializationPhase} from "src/modules/GameModuleInitializationPhase";
import {MapGenTemplate} from "src/templateinterfaces/MapGenTemplate";
import {TemplateCollection} from "src/templateinterfaces/TemplateCollection";

import {spiralGalaxy} from "./templates/spiralGalaxy";
import {tinierSpiralGalaxy} from "./templates/tinierSpiralGalaxy";

import * as moduleInfo from "./moduleInfo.json";


const templates: TemplateCollection<MapGenTemplate> =
{
  [spiralGalaxy.key]: spiralGalaxy,
  [tinierSpiralGalaxy.key]: tinierSpiralGalaxy,
};

export const spaceMapGen: GameModule =
{
  info: moduleInfo,
  phaseToInitializeBefore: GameModuleInitializationPhase.GameSetup,
  supportedLanguages: [englishLanguage],
  addToModuleData: (moduleData: ModuleData) =>
  {
    moduleData.copyTemplates(templates, "MapGen");

    if (!moduleData.defaultMap)
    {
      moduleData.defaultMap = spiralGalaxy;
    }

    return moduleData;
  },
};
