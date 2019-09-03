import {Localizer} from "../../../../src/localization/Localizer";
import {englishLanguage} from "../../../englishlanguage/englishLanguage";
import {passiveSkills as en_passiveSkills} from "./en/passiveSkills";


const allMessages =
{
  ...en_passiveSkills,
};

export const localizer = new Localizer<typeof allMessages>("spacePassiveSkills");
localizer.setAllMessages(allMessages, englishLanguage);

export const localize = localizer.localize.bind(localizer);
