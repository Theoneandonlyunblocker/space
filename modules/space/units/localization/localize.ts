import {StringLocalizer} from "core/localization/StringLocalizer";
import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {units as en_units} from "./en/units";


const allMessages =
{
  ...en_units,
};

export const localizer = new StringLocalizer<typeof allMessages>("spaceUnits");
localizer.setAll(allMessages, englishLanguage);

export const localize = localizer.localize.bind(localizer);
