import * as Languages from "../../../localization/defaultLanguages";
import {Localizer} from "../../../src/localization/Localizer";

import {notificationMessages} from "./en/notificationMessages";


export const localizer = new Localizer<typeof notificationMessages>("notificationMessages");

localizer.setAllMessages(notificationMessages, Languages.en);

export const localize = localizer.localize.bind(localizer);
