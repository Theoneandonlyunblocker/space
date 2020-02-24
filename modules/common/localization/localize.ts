import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";
import {StringLocalizer} from "core/src/localization/StringLocalizer";
import { abilityStrings as en_abilityStrings } from "./en/abilityStrings";


const allStrings =
{
  ...en_abilityStrings
};

export const localizer = new StringLocalizer<typeof allStrings>("drones");
localizer.setAll(allStrings, englishLanguage);

export const localize = localizer.localize.bind(localizer);
