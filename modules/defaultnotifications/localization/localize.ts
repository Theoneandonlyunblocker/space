import {notificationMessages} from "./en/notificationMessages";

import {Localizer} from "../../../src/localization/Localizer";

import * as Languages from "../../../localization/defaultLanguages";


export const localizer = new Localizer<typeof notificationMessages>("notificationMessages");

localizer.registerMessages(notificationMessages, Languages.en);

export const localize = localizer.localize;
