import {Localizer} from "../../../src/localization/Localizer";
import {englishLanguage} from "../../englishlanguage/englishLanguage";
import {attitudeModifiers as en_attitudeModifiers} from "./en/attitudeModifiers";


export type AllMessages =
typeof en_attitudeModifiers;

const mergedMessages: AllMessages =
{

};

export const localizer = new Localizer<AllMessages>("attitudeModifiers");
localizer.setAllMessages(mergedMessages, englishLanguage);

export const localize = <typeof localizer.localize> localizer.localize.bind(localizer);
