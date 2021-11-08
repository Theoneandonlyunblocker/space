import * as MessageFormat from "messageformat";

import {Message, ErrorMessage} from "./Message";
import { BaseLocalizer } from "./Localizer";
import { Language } from "./Language";
import { universalFormatters } from "./universalFormatters";


/**
 * language code must be in https://github.com/eemeli/make-plural/blob/master/packages/plurals/plurals.js to work
 */
export class MessageFormatLocalizer<
  ItemArgs extends {[K in keyof ItemArgs]: any[]}
>
  extends BaseLocalizer<
    Record<keyof ItemArgs, string>,
    {[K in keyof ItemArgs]: Message<ItemArgs[K]>},
    {[K in keyof ItemArgs]: MessageFormat.MessageFunction<ItemArgs[K]>},
    ErrorMessage
  >
{
  private readonly messageFormattersByLanguageCode:
  {
    [languageCode: string]: MessageFormat;
  } = {};
  private readonly errorMessageFormatter: MessageFormat = new MessageFormat("en");

  constructor(key: string)
  {
    super(key);
  }

  public override set(rawMessages: Partial<Record<keyof ItemArgs, string>>, language: Language): void
  {
    if (!this.languageHasBeenInit(language))
    {
      this.initLanguage(language);
    }

    this.itemsByLanguageCode[language.code] =
    {
      ...this.itemsByLanguageCode[language.code],
      ...this.compileRawMessages(rawMessages, language),
    };
  }
  public override localize<K extends keyof ItemArgs>(key: K): Message<ItemArgs[K]> | ErrorMessage
  {
    const compiledMessage = this.get(key);
    if (compiledMessage)
    {
      return new Message(compiledMessage);
    }
    else
    {
      return this.getMissingLocalizationMessage(key);
    }
  }
  public addFormatters(formatters: {[key: string]: MessageFormat.FormatterFunction}, language: Language): void
  {
    if (!this.languageHasBeenInit(language))
    {
      this.initLanguage(language);
    }
    this.messageFormattersByLanguageCode[language.code].addFormatters(formatters);
  }

  private languageHasBeenInit(language: Language): boolean
  {
    return Boolean(this.messageFormattersByLanguageCode[language.code]);
  }
  private initLanguage(language: Language): void
  {
    const mf = this.messageFormattersByLanguageCode[language.code] = new MessageFormat(language.code);
    mf.addFormatters(universalFormatters);
  }
  private compileRawMessages(
    rawMessages: Partial<Record<keyof ItemArgs, string>>,
    language: Language,
  ): {[K in keyof ItemArgs]: MessageFormat.MessageFunction<ItemArgs[K]>}
  {
    const messageFormatter = this.messageFormattersByLanguageCode[language.code];

    return Object.keys(rawMessages).reduce((compiledMessages, key) =>
    {
      compiledMessages[key] = messageFormatter.compile(rawMessages[key]);

      return compiledMessages;
    }, <{[K in keyof ItemArgs]: MessageFormat.MessageFunction<ItemArgs[K]>}>{});
  }
  private getMissingLocalizationMessage(messageKey: keyof ItemArgs): ErrorMessage
  {
    return new ErrorMessage(this.errorMessageFormatter.compile(this.getMissingLocalizationString(messageKey)));
  }
}
