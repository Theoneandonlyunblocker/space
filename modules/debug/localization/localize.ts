import {StringLocalizer} from "core/src/localization/StringLocalizer";
import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";
import {strings as en_strings} from "./en/strings";


const allStrings =
{
  ...en_strings,
};

export const localizer = new StringLocalizer<typeof allStrings>("debug");
localizer.setAll(allStrings, englishLanguage);

export const localize = localizer.localize.bind(localizer);
