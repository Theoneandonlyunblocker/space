import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {ModuleData} from "core/modules/ModuleData";
import {GameModule} from "core/modules/GameModule";
import {GameModuleInitializationPhase} from "core/modules/GameModuleInitializationPhase";
import {MapGenTemplate} from "core/templateinterfaces/MapGenTemplate";
import {TemplateCollection} from "core/templateinterfaces/TemplateCollection";

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
