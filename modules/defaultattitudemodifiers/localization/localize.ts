import {StringLocalizer} from "core/localization/StringLocalizer";
import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {attitudeModifiers as en_attitudeModifiers} from "./en/attitudeModifiers";


const allMessages =
{
  ...en_attitudeModifiers,
};

export const localizer = new StringLocalizer<typeof allMessages>("attitudeModifiers");
localizer.setAll(allMessages, englishLanguage);

export const localize = localizer.localize.bind(localizer);
