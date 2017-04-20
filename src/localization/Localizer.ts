import {Language} from "./Language";
import
{
  LocalizedText,
  LocalizedTextByQuantity,
} from "./LocalizedText";

import {Range} from "../Range";
import
{
  rangesHaveOverlap,
} from "../rangeOperations";

// export class Localizer<Texts extends {[k: string]: LocalizedText}>
export class Localizer<Texts extends {[k in keyof Texts]: LocalizedText}>
{
  private activeLanguage: Language;
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
      if (!Localizer.localizedTextIsValid(<LocalizedText><any>texts[textKey]))
      {
        console.warn(`Invalid localization ${language.code}.${textKey}`);
      }

      this.textsByLanguageCode[language.code][textKey] = texts[textKey];
    }
  }
  /**
   * default props:
   *  quantity = 1
   */
  public tr(key: keyof Texts, props?:
  {
    quantity?: number,
  }): string
  {
    const missingLocalizationString = `${this.activeLanguage.code}.${key}`;

    const textsForActiveLanguage = this.textsByLanguageCode[this.activeLanguage.code];
    if (textsForActiveLanguage)
    {
      const localizedText = this.textsByLanguageCode[this.activeLanguage.code][key];

      if (localizedText)
      {
        if (typeof localizedText === "string")
        {
          // TODO 20.04.2017 | bad typing
          return <string><any>localizedText;
        }
        else
        {
          const quantity = (props && isFinite(props.quantity)) ? props.quantity : 1;


        }
      }
    }

    console.warn(`Missing localization '${missingLocalizationString}'`);

    return missingLocalizationString;
  }
}

const a =
{
  lol: "50",
  b:
  {
    5: "5",
    other: "other",
  },
};

const b = new Localizer<typeof a>();

b.tr("lol");
