import {Language} from "./Language";

import ModuleFile from "../ModuleFile";

export enum LanguageSupportLevel
{
  none,
  partial,
  full,
}

export function getLanguageSupportLevelForModuleFiles(...moduleFiles: ModuleFile[]): LanguageSupportLevelByCode
{
  const totalModulesCount = moduleFiles.length;
  const languageSupportLevelByCode: LanguageSupportLevelByCode = {};

  const modulesGroupedByLanguageSupport = groupModuleFilesByLanguageSupport(...moduleFiles);

  for (let languageCode in modulesGroupedByLanguageSupport)
  {
    const supportedModulesCount = modulesGroupedByLanguageSupport[languageCode].length;
    if (supportedModulesCount < totalModulesCount)
    {
      languageSupportLevelByCode[languageCode] = LanguageSupportLevel.partial;
    }
    else
    {
      languageSupportLevelByCode[languageCode] = LanguageSupportLevel.full;
    }
  }

  return languageSupportLevelByCode;
}

export function getLanguagesByCode(...moduleFiles: ModuleFile[]): LanguagesByCode
{
  const languagesByCode: LanguagesByCode = {};

  moduleFiles.forEach(moduleFile =>
  {
    if (moduleFile.supportedLanguages !== "all")
    {
      moduleFile.supportedLanguages.forEach(language =>
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

interface ModuleFilesByLanguageCode
{
  [languageCode: string]: ModuleFile[];
}

interface LanguagesByCode
{
  [languageCode: string]: Language;
}

function groupModuleFilesByLanguageSupport(...moduleFiles: ModuleFile[]): ModuleFilesByLanguageCode
{
  const moduleFilesByLanguageSupport: ModuleFilesByLanguageCode = {};

  moduleFiles.forEach(moduleFile =>
  {
    if (moduleFile.supportedLanguages !== "all")
    {
      moduleFile.supportedLanguages.forEach(language =>
      {
        if (!moduleFilesByLanguageSupport[language.code])
        {
          moduleFilesByLanguageSupport[language.code] = [];
        }

        moduleFilesByLanguageSupport[language.code].push(moduleFile);
      });
    }
  });

  const universalModuleFiles = moduleFiles.filter(moduleFile =>
  {
    return moduleFile.supportedLanguages === "all";
  });

  for (let code in moduleFilesByLanguageSupport)
  {
    moduleFilesByLanguageSupport[code].push(...universalModuleFiles);
  }

  return moduleFilesByLanguageSupport;
}
