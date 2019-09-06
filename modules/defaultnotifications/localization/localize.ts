import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {formatters as englishFormatters} from "modules/englishlanguage/formatters";
import {MessageFormatLocalizer} from "src/localization/MessageFormatLocalizer";

import {notificationMessages as en_notificationMessages} from "./en/notificationMessages";
import {NotificationMessageArgs} from "./NotificationMessageArgs";


export const localizer = new MessageFormatLocalizer<NotificationMessageArgs>("notificationMessages");
localizer.addFormatters(englishFormatters, englishLanguage);
localizer.setAll(en_notificationMessages, englishLanguage);

export const localize = localizer.localize.bind(localizer);
