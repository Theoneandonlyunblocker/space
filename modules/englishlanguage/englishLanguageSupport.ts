import {GameModule} from "../../src/modules/GameModule";
import {GameModuleInitializationPhase} from "../../src/modules/GameModuleInitializationPhase";
import * as semver from "src/app/versions";

import {englishLanguage} from "./englishLanguage";

import * as moduleInfo from "./moduleInfo.json";
import { EnglishNameTagsSaveData } from "./EnglishName";
import { NameSaveData } from "src/savedata/NameSaveData";


export const englishLanguageSupport: GameModule =
{
  info: moduleInfo,
  phaseToInitializeBefore: GameModuleInitializationPhase.AppInit,
  supportedLanguages: "all",
  addToModuleData: (moduleData) =>
  {
    moduleData.copyTemplates(
    {
      en: englishLanguage,
    }, "Languages");

    return moduleData;
  },
  reviveGameData: (saveData) =>
  {
    const dataVersion = saveData.appVersion;
    // all names before 0.5.0 were english names, so do this here instead of in core
    if (semver.lt(dataVersion, "0.5.0"))
    {
      convertNames();
    }

    function convertNames()
    {
      saveData.gameData.players.forEach((playerSaveData: any) =>
      {
        playerSaveData.name = convertName(playerSaveData.name);
        playerSaveData.fleets.forEach((fleetSaveData: any) =>
        {
          fleetSaveData.name = convertName(fleetSaveData.name);
        });
      });

      function convertName(legacyData:
      {
        fullName: string;
        isPlural: boolean;
        hasBeenCustomized: boolean;
      }): NameSaveData<EnglishNameTagsSaveData>
      {
        return(
        {
          languageCode: englishLanguage.code,
          hasBeenCustomized: legacyData.hasBeenCustomized,
          baseName: legacyData.fullName,
          languageSpecificTags:
          {
            isPlural: legacyData.isPlural,
            definiteArticle: "",
          }
        });
      }
    }
  },
};
