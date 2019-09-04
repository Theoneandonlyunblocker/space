import * as MessageFormat from "messageformat";

import {Message, ErrorMessage} from "./Message";
import { BaseLocalizer } from "./Localizer";
import { Language } from "./Language";
import { options } from "src/app/Options";


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
  private readonly errorMessageFormatter: MessageFormat = new MessageFormat("__error");

  constructor(key: string)
  {
    super(key);
  }

  public set(rawMessages: Partial<Record<keyof ItemArgs, string>>, language: Language): void
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
  public localize<K extends keyof ItemArgs>(key: K): Message<ItemArgs[K]> | ErrorMessage
  {
    const activeLanguage = options.display.language;
    const compiledMessage = this.get(key);
    if (compiledMessage)
    {
      return new Message(compiledMessage);
    }
    else
    {
      return this.getMissingLocalizationMessage(key, activeLanguage);
    }
  }
  public addFormatters(language: Language, formatters: {[key: string]: MessageFormat.FormatterFunction}): void
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
    this.messageFormattersByLanguageCode[language.code] = new MessageFormat(language.code);
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
  private getMissingLocalizationMessage(messageKey: keyof ItemArgs, activeLanguage: Language): ErrorMessage
  {
    return new ErrorMessage(this.errorMessageFormatter.compile(`${this.key}.${activeLanguage.code}.${messageKey}`));
  }
}
