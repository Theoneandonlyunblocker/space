import {Localizer} from "../../../../src/localization/Localizer";
import {englishLanguage} from "../../../englishlanguage/englishLanguage";
import {resources as en_resources} from "./en/resources";


const allMessages =
{
  ...en_resources,
};

export const localizer = new Localizer<typeof allMessages>("spaceResources");
localizer.setAllMessages(allMessages, englishLanguage);

export const localize = localizer.localize.bind(localizer);
