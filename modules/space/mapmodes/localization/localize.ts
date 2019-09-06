import {Localizer} from "src/localization/Localizer";
import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {mapLayers as en_mapLayers} from "./en/mapLayers";
import {mapModes as en_mapModes} from "./en/mapModes";


const allMessages =
{
  ...en_mapLayers,
  ...en_mapModes,
};

export const localizer = new Localizer<typeof allMessages>("spaceMapModes");
localizer.setAll(allMessages, englishLanguage);

export const localize = localizer.localize.bind(localizer);
