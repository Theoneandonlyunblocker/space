import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";
import {Localizer} from "core/src/localization/Localizer";

import {tradeMessages as en_tradeMessages} from "./en/tradeMessages";
import { getRandomArrayItem } from "core/src/generic/utility";


export const localizer = new Localizer<typeof en_tradeMessages, [string]>(
  "tradeMessages",
  (messageKey, language, missingLocalizationString) =>
  {
    return [missingLocalizationString];
  },
);

localizer.setAll(en_tradeMessages, englishLanguage);

export const localize = (key: keyof typeof en_tradeMessages) =>
{
  const messages = localizer.localize(key);

  return getRandomArrayItem(messages);
};
