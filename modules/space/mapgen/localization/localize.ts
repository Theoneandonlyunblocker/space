import {Localizer} from "src/localization/Localizer";
import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {mapGen as en_mapGen} from "./en/mapGen";


const allMessages =
{
  ...en_mapGen,
};

export const localizer = new Localizer<typeof allMessages>("spaceMapGen");
localizer.setAll(allMessages, englishLanguage);

export const localize = localizer.localize.bind(localizer);
