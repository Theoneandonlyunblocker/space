import {notificationMessages} from "./en/notificationMessages";

import {Localizer} from "../../../src/localization/Localizer";

import * as Languages from "../../../localization/defaultLanguages";


export const localizer = new Localizer<typeof notificationMessages>("notificationMessages");

localizer.registerTexts(notificationMessages, Languages.en);

const boundLocalize: typeof localizer.localize = localizer.localize.bind(localizer);

export function localizeF(key: keyof typeof notificationMessages, quantity: number | "plural" = 1)
{
  const realQuantity = quantity === "plural" ? 2 : quantity;

  return boundLocalize(key, realQuantity);
}
export function localize(key: keyof typeof notificationMessages, quantity: number | "plural" = 1)
{
  const realQuantity = quantity === "plural" ? 2 : quantity;

  return boundLocalize(key, realQuantity).format();
}
