import * as Languages from "../defaultLanguages";

import {Localizer} from "../../src/localization/Localizer";

import {trade as enTrade} from "./en";

export const localizer = new Localizer<typeof enTrade>("trade");
localizer.registerTexts(enTrade, Languages.en);

export const localizeF: typeof localizer.localize = localizer.localize.bind(localizer);
export function localize(key: keyof typeof enTrade): string
{
  return localizeF(key).format();
}
