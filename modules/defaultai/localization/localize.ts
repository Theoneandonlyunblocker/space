import {tradeMessages as en_tradeMessages} from "./en/tradeMessages";

import {Localizer} from "../../../src/localization/Localizer";

import * as Languages from "../../../localization/defaultLanguages";


export const localizer = new Localizer<typeof en_tradeMessages>("tradeMessages");

localizer.setAllMessages(en_tradeMessages, Languages.en);

export const localize = localizer.localize.bind(localizer);
