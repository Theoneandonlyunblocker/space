import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";
import {StringLocalizer} from "core/src/localization/StringLocalizer";
import {MessageFormatLocalizer} from "core/src/localization/MessageFormatLocalizer";
import {formatters as englishFormatters} from "modules/englishlanguage/src/formatters";

import { abilityStrings as en_abilityStrings } from "./en/abilityStrings";

import {combatEffects as en_combatEffects} from "./en/combatEffects";
import {CombatEffects as CombatEffects_args} from "./messageArgs/combatEffects";


const allStrings =
{
  ...en_abilityStrings
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

export const messageLocalizer = new MessageFormatLocalizer<MessageArgs>("space");
messageLocalizer.addFormatters(englishFormatters, englishLanguage);
messageLocalizer.setAll(allMessages, englishLanguage);

export const localizeMessage = messageLocalizer.localize.bind(messageLocalizer);
