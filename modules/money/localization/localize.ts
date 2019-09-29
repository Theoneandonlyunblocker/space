import {StringLocalizer} from "core/src/localization/StringLocalizer";
import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";


const allStrings =
{
  money: "Money",
};

export const localizer = new StringLocalizer<typeof allStrings>("drones");
localizer.setAll(allStrings, englishLanguage);

export const localize = localizer.localize.bind(localizer);
