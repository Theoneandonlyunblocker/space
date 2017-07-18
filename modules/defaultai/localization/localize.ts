import {tradeMessages} from "./en/tradeMessages";

import {Localizer} from "../../../src/localization/Localizer";

export const localizer = new Localizer<typeof tradeMessages>("tradeMessages");

export const localize: typeof localizer.localize = localizer.localize.bind(localizer);
