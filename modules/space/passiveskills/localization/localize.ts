import {StringLocalizer} from "core/localization/StringLocalizer";
import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {passiveSkills as en_passiveSkills} from "./en/passiveSkills";


const allMessages =
{
  ...en_passiveSkills,
};

export const localizer = new StringLocalizer<typeof allMessages>("spacePassiveSkills");
localizer.setAll(allMessages, englishLanguage);

export const localize = localizer.localize.bind(localizer);
