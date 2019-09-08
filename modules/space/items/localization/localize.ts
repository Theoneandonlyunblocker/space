import {StringLocalizer} from "core/localization/StringLocalizer";
import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {items as en_items} from "./en/items";


const allMessages =
{
  ...en_items
};

export const localizer = new StringLocalizer<typeof allMessages>("spaceItems");
localizer.setAll(allMessages, englishLanguage);

export const localize = localizer.localize.bind(localizer);
