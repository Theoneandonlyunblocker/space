import app from "../App"; // TODO global

import {Language} from "./Language";
import {getLanguagesByCode} from "./languageSupport";


let activeLanguageCode: string;

export function getActiveLanguage(): Language
{
  const languagesByCode = getLanguagesByCode(...app.moduleData.moduleFiles);

  if (!languagesByCode[activeLanguageCode])
  {
    throw new Error(`Invalid language ${activeLanguageCode}. ` +
      `Valid languages: ${Object.keys(languagesByCode)}`);
  }
  else
  {
    return languagesByCode[activeLanguageCode];
  }
}
export function setActiveLanguageCode(languageCode: string): void
{
  if (languageCode === activeLanguageCode)
  {
    return;
  }

  activeLanguageCode = languageCode;
}
