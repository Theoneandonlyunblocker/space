import * as Languages from "../defaultLanguages";

import {Localizer} from "../../src/localization/Localizer";

import {unitList as enUnitList} from "./en";

export const localizer = new Localizer<typeof enUnitList>("unitList");
localizer.registerTexts(enUnitList, Languages.en);

export const localizeF: typeof localizer.localize = localizer.localize.bind(localizer);
export function localize(key: keyof typeof enUnitList): string
{
  return localizeF(key).format();
}
