import {Language} from "./Language";
import {options} from "../app/Options";


export abstract class BaseLocalizer<
  InputItems extends {[K in keyof InputItems]: any},
  OutputItems extends {[K in keyof InputItems]: any} = InputItems,
  StoredItems extends {[K in keyof InputItems]: any} = InputItems,
  FallbackOutput = never,
>
{
  public readonly key: string;

  protected readonly itemsByLanguageCode:
  {
    [languageCode: string]: StoredItems;
  } = {};

  constructor(key: string)
  {
    this.key = key;
  }

  public setAll(items: InputItems, language: Language): void
  {
    this.set(items, language);
  }
  public set(items: Partial<InputItems>, language: Language): void
  {
    this.itemsByLanguageCode[language.code] =
    {
      ...this.itemsByLanguageCode[language.code],
      ...items,
    };
  }
  public localize<K extends keyof StoredItems>(key: K): OutputItems[K] | FallbackOutput
  {
    const activeLanguage = options.display.language;
    const item = this.get(key);
    if (item)
    {
      return item;
    }
    else
    {
      throw new Error(`Missing localization for '${this.key}.${activeLanguage.code}.${key}'`);
    }
  }
  public getMissingLocalizationString(messageKey: keyof StoredItems): string
  {
    const activeLanguage = options.display.language;

    return `${this.key}.${activeLanguage.code}.${messageKey}`;
  }

  protected get<K extends keyof StoredItems>(key: K): StoredItems[K] | undefined
  {
    const activeLanguage = options.display.language;
    const itemsForLanguage = this.itemsByLanguageCode[activeLanguage.code];
    if (itemsForLanguage && itemsForLanguage[key])
    {
      return itemsForLanguage[key];
    }
    else
    {
      return undefined;
    }
  }
}

export class Localizer<Items extends {[K in keyof Items]: any}> extends BaseLocalizer<Items>
{
  constructor(key: string)
  {
    super(key);
  }
}
