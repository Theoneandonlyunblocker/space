import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {Localizer} from "core/localization/Localizer";

import {tradeMessages as en_tradeMessages} from "./en/tradeMessages";
import { getRandomArrayItem } from "core/generic/utility";


export const localizer = new Localizer<typeof en_tradeMessages>("tradeMessages");

localizer.setAll(en_tradeMessages, englishLanguage);

export const localize = (key: keyof typeof en_tradeMessages) =>
{
  const messages = localizer.localize(key);

  return getRandomArrayItem(messages);
};
