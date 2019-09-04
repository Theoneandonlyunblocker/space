import {Localizer} from "../../../../src/localization/Localizer";
import {englishLanguage} from "../../../englishlanguage/englishLanguage";
import {technologies as en_technologies} from "./en/technologies";


const allMessages =
{
  ...en_technologies,
};

export const localizer = new Localizer<typeof allMessages>("spaceTechnologies");
localizer.setAll(allMessages, englishLanguage);

export const localize = localizer.localize.bind(localizer);
