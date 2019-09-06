import {Localizer} from "src/localization/Localizer";
import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {buildings as en_buildings} from "./en/buildings";


const allMessages =
{
  ...en_buildings,
};

export const localizer = new Localizer<typeof allMessages>("spaceBuildings");
localizer.setAll(allMessages, englishLanguage);

export const localize = localizer.localize.bind(localizer);
