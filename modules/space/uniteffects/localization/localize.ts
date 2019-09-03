import {Localizer} from "../../../../src/localization/Localizer";
import {englishLanguage} from "../../../englishlanguage/englishLanguage";
import {unitEffects as en_unitEffects} from "./en/unitEffects";


const allMessages =
{
  ...en_unitEffects,
};

export const localizer = new Localizer<typeof allMessages>("spaceUnitEffects");
localizer.setAllMessages(allMessages, englishLanguage);

export const localize = localizer.localize.bind(localizer);
