import {Localizer} from "../../../src/localization/Localizer";
import {englishLanguage} from "../../englishlanguage/englishLanguage";
import {attitudeModifiers as en_attitudeModifiers} from "./en/attitudeModifiers";


const allMessages =
{
  ...en_attitudeModifiers,
};

export const localizer = new Localizer<typeof allMessages>("attitudeModifiers");
localizer.setAllMessages(allMessages, englishLanguage);

export const localize = <typeof localizer.localize> localizer.localize.bind(localizer);
