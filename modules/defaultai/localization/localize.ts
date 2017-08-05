import {tradeMessages} from "./en/tradeMessages";

import {Localizer} from "../../../src/localization/Localizer";

import * as Languages from "../../../localization/defaultLanguages";


export const localizer = new Localizer<typeof tradeMessages>("tradeMessages");

localizer.registerTexts(tradeMessages, Languages.en);

export const localize: typeof localizer.localize = localizer.localize.bind(localizer);
