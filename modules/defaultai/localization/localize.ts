import {englishLanguage} from "../../englishlanguage/englishLanguage";
import {Localizer} from "../../../src/localization/Localizer";

import {tradeMessages as en_tradeMessages} from "./en/tradeMessages";


export const localizer = new Localizer<typeof en_tradeMessages>("tradeMessages");

localizer.setAllMessages(en_tradeMessages, englishLanguage);

export const localize = localizer.localize.bind(localizer);
