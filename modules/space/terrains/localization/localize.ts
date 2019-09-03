import {Localizer} from "../../../../src/localization/Localizer";
import {englishLanguage} from "../../../englishlanguage/englishLanguage";
import {terrains as en_terrains} from "./en/terrains";


const allMessages =
{
  ...en_terrains,
};

export const localizer = new Localizer<typeof allMessages>("spaceTerrains");
localizer.setAllMessages(allMessages, englishLanguage);

export const localize = localizer.localize.bind(localizer);
