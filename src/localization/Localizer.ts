import {IntermediateLocalizedString} from "./IntermediateLocalizedString";
import {Language} from "./Language";
import
{
  LocalizedText,
  LocalizedTextByQuantity,
} from "./LocalizedText";
import {getActiveLanguage} from "./activeLanguage";

import {Range} from "../Range";
import
{
  rangesHaveOverlap,
} from "../rangeOperations";
import
{
  getRandomArrayItem,
} from "../utility";


export class Localizer<Texts extends {[k in keyof Texts]: LocalizedText[]}>
{
  private readonly textsByLanguageCode:
  {
    [languageCode: string]: Texts;
  } = {};

  constructor()
  {

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

    const min = match[1] === "" ? -Infinity : Number(match[1]);
    const max = match[2] === "" ? Infinity : Number(match[2]);

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

      if(rangesHaveOverlap(allRanges))
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
        Call ${this.registerTexts} first.`);
    }

    for (let textKey in texts)
    {
      if (!this.textsByLanguageCode[language.code][textKey])
      {
        // TODO 2017.04.24 | bad typing
        this.textsByLanguageCode[language.code][textKey] = <any> [];
      }

      // TODO 2017.04.24 | bad typing
      const localizedTexts = <LocalizedText[]><any> texts[textKey];

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
  /**
   * default props:
   *  quantity = 1
   */
  public localize(key: keyof Texts, props?:
  {
    quantity?: number,
  }): IntermediateLocalizedString
  {
    const activeLanguage = getActiveLanguage();
    const missingLocalizationString = `${activeLanguage.code}.${key}`;

    const textsForActiveLanguage = this.textsByLanguageCode[activeLanguage.code];
    if (textsForActiveLanguage)
    {
      // TODO 2017.04.25 | bad typing
      const localizedTexts = <LocalizedText[]><any> this.textsByLanguageCode[activeLanguage.code][key];

      if (localizedTexts && localizedTexts.length > 0)
      {
        const localizedText = getRandomArrayItem(localizedTexts);

        if (typeof localizedText === "string")
        {
          // TODO 2017.04.20 | bad typing
          return new IntermediateLocalizedString(<string><any>localizedText);
        }
        else
        {
          const quantity = (props && isFinite(props.quantity)) ? props.quantity : 1;
          const matchingText = Localizer.getStringFromLocalizedTextByQuantity(
            // TODO 2017.04.20 | bad typing
            <LocalizedTextByQuantity><any>localizedText,
            quantity,
          );

          return new IntermediateLocalizedString(matchingText);
        }
      }
    }

    console.warn(`Missing localization '${missingLocalizationString}'`);

    return new IntermediateLocalizedString(missingLocalizationString);
  }
}
