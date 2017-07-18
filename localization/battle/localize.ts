import * as Languages from "../defaultLanguages";

import {Localizer} from "../../src/localization/Localizer";

import {battle as enBattle} from "./en";

export const localizer = new Localizer<typeof enBattle>("battle");
localizer.registerTexts(enBattle, Languages.en);

export const localizeF: typeof localizer.localize = localizer.localize.bind(localizer);
export function localize(key: keyof typeof enBattle): string
{
  return localizeF(key).format();
}
