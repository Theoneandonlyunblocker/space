import {StringLocalizer} from "core/localization/StringLocalizer";
import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {resources as en_resources} from "./en/resources";


const allMessages =
{
  ...en_resources,
};

export const localizer = new StringLocalizer<typeof allMessages>("spaceResources");
localizer.setAll(allMessages, englishLanguage);

export const localize = localizer.localize.bind(localizer);
