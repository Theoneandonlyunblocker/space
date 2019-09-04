import {englishLanguage} from "../../englishlanguage/englishLanguage";
import {Localizer} from "../../../src/localization/Localizer";

import {tradeMessages as en_tradeMessages} from "./en/tradeMessages";
import { getRandomArrayItem } from "src/generic/utility";


export const localizer = new Localizer<typeof en_tradeMessages>("tradeMessages");

localizer.setAll(en_tradeMessages, englishLanguage);

export const localize = (key: keyof typeof en_tradeMessages) =>
{
  const messages = localizer.localize(key);

  return getRandomArrayItem(messages);
};
