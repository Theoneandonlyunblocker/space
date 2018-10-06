/// <reference path="../../lib/messageformat.d.ts" />

import {formatters} from "./formatters";

import
{
  getRandomArrayItem,
} from "../utility";

import {Language} from "./Language";
import {getActiveLanguage} from "./activeLanguage";


// messageformat.js requires positional arguments to be wrapped in an array.
// create wrapper function that packs up args in an array if needed
function wrapMessageFunction(messageFN: MessageFunction<any>): MessageFunction<any>
{
  return (...args: any[]) =>
  {
    if (args.length === 0 || (typeof args[0] === "object" && args[0] !== null))
    {
      return messageFN.apply(null, args);
    }
    else
    {
      return messageFN(args);
    }
  };
}

export class Localizer<Messages extends {[K in keyof Messages]: (string | string[])}>
{
  public readonly key: string;

  private readonly messageFormattersByLanguageCode:
  {
    [languageCode: string]: MessageFormat;
  } = {};
  private readonly messagesByLanguageCode:
  {
    [languageCode: string]: {[K in keyof Messages]: string[]};
  } = {};
  private readonly compiledMessagesByLanguageCode:
  {
    [langaugeCode: string]:
    {
      // tslint:disable-next-line:no-any
      [K in keyof Messages]: MessageFunction<any>[];
    };
  } = {};

  private readonly warningMessagesOutputted:
  {
    [message: string]: boolean;
  } = {};

  constructor(key: string)
  {
    this.key = key;
  }

  // for checking all messages are present
  public setAllMessages(messages: Messages, language: Language): void
  {
    this.setMessages(messages, language);
  }
  public setMessages(messages: Partial<Messages>, language: Language): void
  {
    if (this.languageHasBeenInit(language))
    {
      this.clearMessages(messages, language);
    }
    this.appendMessages(messages, language);
  }
  // public appendMessages(messages: Partial<Messages>, language: Language): void
  // ^^^ why is this an error?
  public appendMessages(messages: {[K in Extract<keyof Messages, string>]?: Messages[K]}, language: Language): void
  {
    if (!this.languageHasBeenInit(language))
    {
      this.initLanguage(language);
    }

    for (const key in messages)
    {
      const messagesForKey = Array.isArray(messages[key]) ?
        messages[key] as string[] :
        [messages[key] as string];

      if (!this.messagesByLanguageCode[language.code][key])
      {
        this.messagesByLanguageCode[language.code][key] = [];
      }
      this.messagesByLanguageCode[language.code][key].push(...messagesForKey);

      if (!this.compiledMessagesByLanguageCode[language.code][key])
      {
        this.compiledMessagesByLanguageCode[language.code][key] = [];
      }
      this.compiledMessagesByLanguageCode[language.code][key].push(...messagesForKey.map(message =>
      {
        return this.compileMessage(message, language);
      }));
    }
  }
  // would be nice to have typing here. don't think it's feasible right now
  // tslint:disable-next-line:no-any
  public localize(key: keyof Messages): MessageFunction<any>
  {
    const activeLanguage = getActiveLanguage();

    const compiledMessagesForLanguage = this.compiledMessagesByLanguageCode[activeLanguage.code];
    if (compiledMessagesForLanguage)
    {
      const matchingCompiledMessages = this.compiledMessagesByLanguageCode[activeLanguage.code][key];

      if (matchingCompiledMessages)
      {
        return wrapMessageFunction(getRandomArrayItem(matchingCompiledMessages));
      }
    }

    const missingLocalizationMessageFunction = this.getMissingLocalizationMessage.bind(this, key, activeLanguage);
    this.warnOfMissingLocalization(missingLocalizationMessageFunction());

    return wrapMessageFunction(missingLocalizationMessageFunction);
  }

  private languageHasBeenInit(language: Language): boolean
  {
    return Boolean(this.messagesByLanguageCode[language.code]);
  }
  private initLanguage(language: Language): void
  {
    this.messagesByLanguageCode[language.code] = <{[K in keyof Messages]: string[]}> {};

    this.messageFormattersByLanguageCode[language.code] = new MessageFormat(language.code);
    this.messageFormattersByLanguageCode[language.code].addFormatters(formatters);
    // tslint:disable-next-line:no-any
    this.compiledMessagesByLanguageCode[language.code] = <{[K in keyof Messages]: MessageFunction<any>[]}> {};
  }
  private clearMessages(messages: Partial<Messages>, language: Language): void
  {
    for (const key in messages)
    {
      this.messagesByLanguageCode[language.code][key] = [];
      this.compiledMessagesByLanguageCode[language.code][key] = [];
    }
  }
  // tslint:disable-next-line:no-any
  private compileMessage<T = any>(message: string, language: Language): MessageFunction<T>
  {
    const messageFormatter = this.messageFormattersByLanguageCode[language.code];

    return messageFormatter.compile(message);
  }
  private getMissingLocalizationMessage(key: keyof Messages, activeLanguage: Language): string
  {
    return `${this.key}.${activeLanguage.code}.${key}`;
  }
  private warnOfMissingLocalization(warningMessage: string): void
  {
    if (!this.warningMessagesOutputted[warningMessage])
    {
      this.warningMessagesOutputted[warningMessage] = true;

      console.warn(`Missing localization: ${warningMessage}`);
    }
  }
}
