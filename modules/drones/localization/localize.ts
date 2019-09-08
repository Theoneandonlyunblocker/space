import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {Localizer} from "core/localization/Localizer";

import {names as en_names} from "./en/names";
import {units as en_units} from "./en/units";
import {unitEffects as en_unitEffects} from "./en/unitEffects";
import {abilities as en_abilities} from "./en/abilities";
import { Name } from "core/localization/Name";


export const nameLocalizer = new Localizer<typeof en_names, () => Name>(
  "droneNames",
  (nameKey, language, missingLocalizationSTring) =>
  {
    return () => language.constructName(missingLocalizationSTring);
  },
);
nameLocalizer.setAll(en_names, englishLanguage);

export const localizeName = nameLocalizer.localize.bind(nameLocalizer);

const allMessages =
{
  ...en_units,
  ...en_unitEffects,
  ...en_abilities,
};

export const localizer = new Localizer<typeof allMessages>("drones");
localizer.setAll(allMessages, englishLanguage);

export const localize = localizer.localize.bind(localizer);
