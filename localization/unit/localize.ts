import * as Languages from "../defaultLanguages";

import {Localizer} from "../../src/localization/Localizer";

import {unit as enUnit} from "./en";

export const localizer = new Localizer<typeof enUnit>("unit");
localizer.registerTexts(enUnit, Languages.en);

export const localizeF: typeof localizer.localize = localizer.localize.bind(localizer);
export function localize(key: keyof typeof enUnit): string
{
  return localizeF(key).format();
}
