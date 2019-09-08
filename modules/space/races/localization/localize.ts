import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {Localizer} from "core/localization/Localizer";

import {names as en_names} from "./en/names";
import { Name } from "core/localization/Name";


export const nameLocalizer = new Localizer<typeof en_names, () => Name>(
  "spaceRaceNames",
  (nameKey, language, missingLocalizationString) =>
  {
    return () => language.constructName(missingLocalizationString);
  },
);
nameLocalizer.setAll(en_names, englishLanguage);
export const localizeName = nameLocalizer.localize.bind(nameLocalizer);
