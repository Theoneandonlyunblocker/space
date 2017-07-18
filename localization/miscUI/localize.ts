import * as Languages from "../defaultLanguages";

import {Localizer} from "../../src/localization/Localizer";

import {miscUI as enMiscUI} from "./en";

export const localizer = new Localizer<typeof enMiscUI>();
localizer.registerTexts(enMiscUI, Languages.en);

export const localizeF: typeof localizer.localize = localizer.localize.bind(localizer);
export function localize(key: keyof typeof enMiscUI): string
{
  return localizeF(key).format();
}
