import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";
import {formatters as englishFormatters} from "modules/englishlanguage/src/formatters";
import {MessageFormatLocalizer} from "core/src/localization/MessageFormatLocalizer";
import {StringLocalizer} from "core/src/localization/StringLocalizer";

import {notificationMessages as en_notificationMessages} from "./en/notificationMessages";
import {NotificationMessageArgs} from "./NotificationMessageArgs";
import { notificationTemplateStrings } from "./en/notificationTemplateStrings";


export const localizer = new MessageFormatLocalizer<NotificationMessageArgs>("notificationMessages");
localizer.addFormatters(englishFormatters, englishLanguage);
localizer.setAll(en_notificationMessages, englishLanguage);

export const localize = localizer.localize.bind(localizer);

export const stringLocalizer = new StringLocalizer<typeof notificationTemplateStrings>("notifications");
stringLocalizer.setAll(notificationTemplateStrings, englishLanguage);

export const localizeString = stringLocalizer.localize.bind(stringLocalizer);
