import {GameModule} from "core/src/modules/GameModule";
import * as semver from "core/src/app/versions";

import {englishLanguage} from "./englishLanguage";

import * as moduleInfo from "../moduleInfo.json";
import { EnglishNameTagsSaveData, defaultEnglishNameTags } from "./EnglishName";
import { NameSaveData } from "core/src/savedata/NameSaveData";
import * as debug from "core/src/app/debug";


export const englishLanguageSupport: GameModule =
{
  info: moduleInfo,
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
    // all names used to be english names, so do this here instead of in core
    if (semver.lt(dataVersion, "0.5.0"))
    {
      debug.log("saves", `Executing stored core save data reviver function 'convertPlayerAndFleetNames'`);
      convertPlayerAndFleetNames();
    }
    if (semver.lt(dataVersion, "0.5.1"))
    {
      debug.log("saves", `Executing stored core save data reviver function 'convertUnitNames'`);
      convertUnitNames();
    }

    function convertPlayerAndFleetNames()
    {
      saveData.gameData.players.forEach((playerSaveData: any) =>
      {
        playerSaveData.name = convertOldName(playerSaveData.name);
        playerSaveData.fleets.forEach((fleetSaveData: any) =>
        {
          fleetSaveData.name = convertOldName(fleetSaveData.name);
        });
      });

      function convertOldName(legacyData:
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
            ...defaultEnglishNameTags,
            isPlural: legacyData.isPlural,
          },
        });
      }
    }

    function convertUnitNames()
    {
      saveData.gameData.units.forEach((unitSaveData: any) =>
      {
        unitSaveData.name = convertStringName(unitSaveData.name);
      });

      function convertStringName(legacyName: string): NameSaveData<EnglishNameTagsSaveData>
      {
        return(
        {
          languageCode: englishLanguage.code,
          hasBeenCustomized: false,
          baseName: legacyName,
          languageSpecificTags:
          {
            ...defaultEnglishNameTags,
            isPlural: legacyName.charAt(legacyName.length - 1) === "s", // close enough
          },
        });
      }
    }
  },
};
