import {GameModule} from "../modules/GameModule";

import {Language} from "./Language";


export enum LanguageSupportLevel
{
  None,
  Partial,
  Full,
}

export function getLanguageSupportLevelForGameModules(...gameModules: GameModule[]): LanguageSupportLevelByCode
{
  const totalModulesCount = gameModules.length;
  const languageSupportLevelByCode: LanguageSupportLevelByCode = {};

  const modulesGroupedByLanguageSupport = groupGameModulesByLanguageSupport(...gameModules);

  for (const languageCode in modulesGroupedByLanguageSupport)
  {
    const supportedModulesCount = modulesGroupedByLanguageSupport[languageCode].length;
    if (supportedModulesCount < totalModulesCount)
    {
      languageSupportLevelByCode[languageCode] = LanguageSupportLevel.Partial;
    }
    else
    {
      languageSupportLevelByCode[languageCode] = LanguageSupportLevel.Full;
    }
  }

  return languageSupportLevelByCode;
}

export function getLanguagesByCodeFromGameModules(...gameModules: GameModule[]): LanguagesByCode
{
  const languagesByCode: LanguagesByCode = {};

  gameModules.forEach(gameModule =>
  {
    if (gameModule.supportedLanguages !== "all")
    {
      gameModule.supportedLanguages.forEach(language =>
      {
        languagesByCode[language.code] = language;
      });
    }
  });

  return languagesByCode;
}

interface LanguageSupportLevelByCode
{
  [languageCode: string]: LanguageSupportLevel;
}

interface GameModulesByLanguageCode
{
  [languageCode: string]: GameModule[];
}

interface LanguagesByCode
{
  [languageCode: string]: Language;
}

function groupGameModulesByLanguageSupport(...gameModules: GameModule[]): GameModulesByLanguageCode
{
  const gameModulesByLanguageSupport: GameModulesByLanguageCode = {};

  gameModules.forEach(gameModule =>
  {
    if (gameModule.supportedLanguages !== "all")
    {
      gameModule.supportedLanguages.forEach(language =>
      {
        if (!gameModulesByLanguageSupport[language.code])
        {
          gameModulesByLanguageSupport[language.code] = [];
        }

        gameModulesByLanguageSupport[language.code].push(gameModule);
      });
    }
  });

  const universalGameModules = gameModules.filter(gameModule =>
  {
    return gameModule.supportedLanguages === "all";
  });

  for (const code in gameModulesByLanguageSupport)
  {
    gameModulesByLanguageSupport[code].push(...universalGameModules);
  }

  return gameModulesByLanguageSupport;
}
