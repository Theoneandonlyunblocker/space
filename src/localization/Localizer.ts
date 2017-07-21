import {IntermediateLocalizedString} from "./IntermediateLocalizedString";
import {Language} from "./Language";
import
{
  LocalizedText,
  LocalizedTextByQuantity,
} from "./LocalizedText";
import {getActiveLanguage} from "./activeLanguage";
import {transformers} from "./transformers";

import {Range} from "../Range";
import
{
  rangesHaveOverlap,
} from "../rangeOperations";
import
{
  getRandomArrayItem,
} from "../utility";


export class Localizer<Texts extends {[k in keyof Texts]: LocalizedText | LocalizedText[]}>
{
  public readonly key: string;

  private readonly textsByLanguageCode:
  {
    [languageCode: string]: Texts;
  } = {};

  constructor(key: string)
  {
    this.key = key;
  }

  private static parseRangeString(rangeString: string): Range | null
  {
    // ^signed_float?\.\.signed_float?$
    const rangeRegex = /^(-?(?:0|[1-9]\d*)(?:\.\d+)?)?\.\.(-?(?:0|[1-9]\d*)(?:\.\d+)?)?$/;

    const match = rangeString.match(rangeRegex);
    if (!match)
    {
      return null;
    }

    const min = match[1] ? Number(match[1]) : -Infinity;
    const max = match[2] ? Number(match[2]) : Infinity;

    return {min: min, max: max};
  }
  private static localizedTextIsValid(text: LocalizedText): boolean
  {
    if (typeof text === "string")
    {
      return true;
    }
    else
    {
      const textByQuantity = <LocalizedTextByQuantity> text;
      const allRanges: Range[] = [];

      for (let quantityKey in textByQuantity)
      {
        if (quantityKey === "other")
        {
          continue;
        }
        else if (!isNaN(Number(quantityKey)))
        {
          continue;
        }
        else
        {
          const range = Localizer.parseRangeString(quantityKey);

          if (!range)
          {
            console.warn(`Couldn't parse range string '${quantityKey}' ${text}`);

            return false;
          }
          else if (!isFinite(range.min) && !isFinite(range.max))
          {
            console.warn(`Infinite range string '${quantityKey}' ${text}. Please use 'other' as the key instead.`);

            return false;
          }
          else
          {
            allRanges.push(range);
            continue;
          }
        }
      }

      if (rangesHaveOverlap(...allRanges))
      {
        console.warn(`Ambiguous quantity-dependant localization. Overlapping ranges in ${text}.`);

        return false;
      }


      return true;
    }
  }
  private static getStringFromLocalizedTextByQuantity(
    text: LocalizedTextByQuantity,
    quantity: number,
  ): string
  {
    for (let quantityString in text)
    {
      if (quantityString === "other")
      {
        continue;
      }
      // exact number
      else if (!isNaN(Number(quantityString)))
      {
        const quantityStringValue = Number(quantityString);

        const delta = Math.abs(quantity - quantityStringValue);
        const epsilon = 0.00001;

        if (delta < epsilon)
        {
          return text[quantityString];
        }
      }
      // ranges
      else
      {
        const range = Localizer.parseRangeString(quantityString);

        if (quantity >= range.min && quantity <= range.max)
        {
          return text[quantityString];
        }
      }
    }

    return text.other;
  }

  public registerTexts(texts: Texts, language: Language): void
  {
    this.textsByLanguageCode[language.code] = <Texts> {};

    this.appendTexts(texts, language);
  }
  public appendTexts(texts: Partial<Texts>, language: Language): void
  {
    if (!this.textsByLanguageCode[language.code])
    {
      throw new Error(`No texts registered for language code ${language.code}.
        Call Localizer.registerTexts first.`);
    }

    for (let textKey in texts)
    {
      if (!this.textsByLanguageCode[language.code][textKey])
      {
        // TODO 2017.04.24 | bad typing
        this.textsByLanguageCode[language.code][textKey] = <any> [];
      }

      // TODO 2017.04.24 | bad typing
      const localizedTexts = <LocalizedText[]><any> (Array.isArray(texts[textKey]) ?
        texts[textKey] :
        [texts[textKey]]);

      localizedTexts.forEach(text =>
      {
        const isValid = Localizer.localizedTextIsValid(text);

        if (isValid)
        {
          // TODO 2017.04.24 | bad typing
          (<LocalizedText[]><any> this.textsByLanguageCode[language.code][textKey]).push(text);
        }
        else
        {
          console.warn(`Invalid localization ${language.code}.${textKey}`);
        }
      });
    }
  }
  public localize(key: keyof Texts, quantity: number = 1): IntermediateLocalizedString
  {
    return new IntermediateLocalizedString(this.localizeRaw(key, quantity));
  }

  private processNestedLocalizations(s: string, quantity: number): string
  {
   return s.replace(
      /([\[\]])\1|[\[](.*?)(?:!(.+?))?[\]]/g,
      (match, literal, key, transformerKey) =>
      {
        if (literal)
        {
          return literal;
        }

        if (!key)
        {
          throw new Error(`Invalid nested localization text ${s}`);
        }

        const localized = this.localizeRaw(key, quantity);

        if (transformerKey)
        {
          if (transformers[transformerKey])
          {
            return transformers[transformerKey](localized);
          }
          else
          {
            throw new Error(`Invalid transformer ${transformerKey} in text ${s}.\n` +
              `Valid transformers: ${Object.keys(transformers).join(", ")}`);
          }
        }
        else
        {
          return localized;
        }
      });
  }
  private localizeRaw(key: keyof Texts, quantity: number): string
  {
    const activeLanguage = getActiveLanguage();
    const missingLocalizationString = `${activeLanguage.code}.${this.key}.${key}`;

    const textsForActiveLanguage = this.textsByLanguageCode[activeLanguage.code];
    if (textsForActiveLanguage)
    {
      // TODO 2017.04.25 | bad typing
      const localizedTexts = <LocalizedText[]><any> this.textsByLanguageCode[activeLanguage.code][key];

      if (localizedTexts && localizedTexts.length > 0)
      {
        const localizedText = getRandomArrayItem(localizedTexts);
        const stringForQuantity = (typeof localizedText === "string") ?
          localizedText :
          Localizer.getStringFromLocalizedTextByQuantity(
            // TODO 2017.04.20 | bad typing
            <LocalizedTextByQuantity><any>localizedText,
            quantity,
          );

        const processedText = this.processNestedLocalizations(stringForQuantity, quantity);

        return processedText;
      }
    }

    console.warn(`Missing localization '${missingLocalizationString}'`);

    return missingLocalizationString;
  }
}
