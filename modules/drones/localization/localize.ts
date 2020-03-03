import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";
import {Localizer} from "core/src/localization/Localizer";
import {StringLocalizer} from "core/src/localization/StringLocalizer";

import {names as en_names} from "./en/names";
import {units as en_units} from "./en/units";
import {combatEffects as en_unitEffects} from "./en/combatEffects";
import {abilities as en_abilities} from "./en/abilities";
import { Name } from "core/src/localization/Name";


const allNames =
{
  ...en_names,
};

type GenericNamesType = {[K in keyof typeof allNames]: (...args: Parameters<typeof allNames[K]>) => Name};

export const nameLocalizer = new Localizer<GenericNamesType, () => Name>(
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

export const localizer = new StringLocalizer<typeof allMessages>("drones");
localizer.setAll(allMessages, englishLanguage);

export const localize = localizer.localize.bind(localizer);
