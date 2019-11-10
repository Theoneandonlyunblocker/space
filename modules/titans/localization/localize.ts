import {StringLocalizer} from "core/src/localization/StringLocalizer";
import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";
import {strings as en_strings} from "./en/strings";
import {uiStrings as en_uiStrings} from "./en/uiStrings";


const allStrings =
{
  ...en_strings,
  ...en_uiStrings,
};

export const localizer = new StringLocalizer<typeof allStrings>("titans");
localizer.setAll(allStrings, englishLanguage);

export const localize = localizer.localize.bind(localizer);
