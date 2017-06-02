import {tradeMessages} from "./en/tradeMessages";

import {Localizer} from "../../../src/localization/Localizer";

const localizer = new Localizer<typeof tradeMessages>();

export const localize: typeof localizer.localize = localizer.localize.bind(localizer);
