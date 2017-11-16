/// <reference path="../../lib/messageformat.d.ts" />

import {Language} from "./Language";
import {getActiveLanguage} from "./activeLanguage";


export class Localizer<Messages extends {[K in keyof Messages]: string}>
{
  public readonly key: string;

  private readonly messageFormattersByLanguageCode:
  {
    [languageCode: string]: MessageFormat;
  } = {};
  private readonly messagesByLanguageCode:
  {
    [languageCode: string]: Messages;
  } = {};
  private readonly compiledMessagesByLanguageCode:
  {
    [langaugeCode: string]:
    {
      // tslint:disable-next-line:no-any
      [K in keyof Messages]: MessageFunction<any>;
    },
  } = {};

  private readonly warningMessagesOutputted:
  {
    [message: string]: boolean;
  } = {};

  constructor(key: string)
  {
    this.key = key;
  }

  public registerMessages(messages: Partial<Messages>, language: Language): void
  {
    if (!this.messagesByLanguageCode[language.code])
    {
      this.messagesByLanguageCode[language.code] = <Messages> {};
    }

    for (let key in messages)
    {
      this.messagesByLanguageCode[language.code][key] = messages[key];
      this.compileMessage(key, language);
    }
  }

  // TODO 2017.11.16 | can we add typing here?
  // tslint:disable-next-line:no-any
  public localize(key: keyof Messages): MessageFunction<any>
  {
    const activeLanguage = getActiveLanguage();

    const compiledMessagesForLanguage = this.compiledMessagesByLanguageCode[activeLanguage.code];
    if (compiledMessagesForLanguage)
    {
      const matchingCompiledMessage = this.compiledMessagesByLanguageCode[activeLanguage.code][key];

      if (matchingCompiledMessage)
      {
        return matchingCompiledMessage;
      }
    }

    const missingLocalizationMessageFunction = this.getMissingLocalizationMessage.bind(this, key, activeLanguage);
    this.warnOfMissingLocalization(missingLocalizationMessageFunction());

    return missingLocalizationMessageFunction;
  }

  private compileMessage(key: keyof Messages, language: Language): void
  {
    if (!this.messageFormattersByLanguageCode[language.code])
    {
      this.messageFormattersByLanguageCode[language.code] = new MessageFormat(language.code);
      // tslint:disable-next-line:no-any
      this.compiledMessagesByLanguageCode[language.code] = <{[K in keyof Messages]: MessageFunction<any>}>  {};
    }

    const messageFormatter = this.messageFormattersByLanguageCode[language.code];

    this.compiledMessagesByLanguageCode[language.code][key] = messageFormatter.compile(this.messagesByLanguageCode[language.code][key]);
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
