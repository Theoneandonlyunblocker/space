import * as Languages from "../defaultLanguages";

import {Localizer} from "../../src/localization/Localizer";

import {items as enItems} from "./en";

export const localizer = new Localizer<typeof enItems>("items");
localizer.registerTexts(enItems, Languages.en);

export const localizeF: typeof localizer.localize = localizer.localize.bind(localizer);
export function localize(key: keyof typeof enItems): string
{
  return localizeF(key).format();
}
