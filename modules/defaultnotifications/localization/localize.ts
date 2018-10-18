import {englishLanguage} from "../../englishlanguage/englishLanguage";
import {Localizer} from "../../../src/localization/Localizer";

import {notificationMessages} from "./en/notificationMessages";


export const localizer = new Localizer<typeof notificationMessages>("notificationMessages");

localizer.setAllMessages(notificationMessages, englishLanguage);

export const localize = <typeof localizer.localize> localizer.localize.bind(localizer);
