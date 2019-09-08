import {StringLocalizer} from "core/localization/StringLocalizer";
import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {abilities as en_abilities} from "./en/abilities";


const allMessages =
{
  ...en_abilities,
};

export const localizer = new StringLocalizer<typeof allMessages>("spaceAbilities");
localizer.setAll(allMessages, englishLanguage);

export const localize = localizer.localize.bind(localizer);
