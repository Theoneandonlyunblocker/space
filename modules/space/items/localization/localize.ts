import {Localizer} from "../../../../src/localization/Localizer";
import {englishLanguage} from "../../../englishlanguage/englishLanguage";
import {items as en_items} from "./en/items";


const allMessages =
{
  ...en_items
};

export const localizer = new Localizer<typeof allMessages>("spaceItems");
localizer.setAll(allMessages, englishLanguage);

export const localize = localizer.localize.bind(localizer);
