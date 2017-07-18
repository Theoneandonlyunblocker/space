import * as Languages from "../defaultLanguages";

import {Localizer} from "../../src/localization/Localizer";

import {player as enPlayer} from "./en";

export const localizer = new Localizer<typeof enPlayer>("player");
localizer.registerTexts(enPlayer, Languages.en);

export const localizeF: typeof localizer.localize = localizer.localize.bind(localizer);
export function localize(key: keyof typeof enPlayer): string
{
  return localizeF(key).format();
}
