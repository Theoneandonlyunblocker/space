import {Localizer} from "../../../../src/localization/Localizer";
import {englishLanguage} from "../../../englishlanguage/englishLanguage";
import {abilities as en_abilities} from "./en/abilities";


const allMessages =
{
  ...en_abilities,
};

export const localizer = new Localizer<typeof allMessages>("spaceAbilities");
localizer.setAll(allMessages, englishLanguage);

export const localize = localizer.localize.bind(localizer);
