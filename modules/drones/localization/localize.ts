import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";
import {Localizer} from "core/src/localization/Localizer";
import {StringLocalizer} from "core/src/localization/StringLocalizer";
import {MessageFormatLocalizer} from "core/src/localization/MessageFormatLocalizer";
import {formatters as englishFormatters} from "modules/englishlanguage/src/formatters";

import {units as en_units} from "./en/units";
import {items as en_items} from "./en/items";
import {abilities as en_abilities} from "./en/abilities";

import {combatEffects as en_combatEffects} from "./en/combatEffects";
import {CombatEffects as CombatEffects_args} from "./messageArgs/combatEffects";

import {names as en_names} from "./en/names";
import { Name } from "core/src/localization/Name";


const allStrings =
{
  ...en_units,
  ...en_abilities,
  ...en_items,
};

export const localizer = new StringLocalizer<typeof allStrings>("drones");
localizer.setAll(allStrings, englishLanguage);

export const localize = localizer.localize.bind(localizer);


type MessageArgs =
  CombatEffects_args;

const allMessages =
{
  ...en_combatEffects,
};

export const messageLocalizer = new MessageFormatLocalizer<MessageArgs>("drones");
messageLocalizer.addFormatters(englishFormatters, englishLanguage);
messageLocalizer.setAll(allMessages, englishLanguage);

export const localizeMessage = messageLocalizer.localize.bind(messageLocalizer);


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
