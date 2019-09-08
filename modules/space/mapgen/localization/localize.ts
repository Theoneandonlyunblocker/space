import {StringLocalizer} from "core/localization/StringLocalizer";
import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {mapGen as en_mapGen} from "./en/mapGen";


const allMessages =
{
  ...en_mapGen,
};

export const localizer = new StringLocalizer<typeof allMessages>("spaceMapGen");
localizer.setAll(allMessages, englishLanguage);

export const localize = localizer.localize.bind(localizer);
