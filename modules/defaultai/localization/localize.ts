import * as Languages from "../../../localization/defaultLanguages";
import {Localizer} from "../../../src/localization/Localizer";

import {tradeMessages as en_tradeMessages} from "./en/tradeMessages";


export const localizer = new Localizer<typeof en_tradeMessages>("tradeMessages");

localizer.setAllMessages(en_tradeMessages, Languages.en);

export const localize = localizer.localize.bind(localizer);
