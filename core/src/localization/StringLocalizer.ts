import { Localizer } from "./Localizer";


export class StringLocalizer<Items extends {[K in keyof Items]: string}> extends Localizer<Items, string>
{
  constructor(key: string)
  {
    super(key, (inputItemKey, language, missingLocalizationString) => missingLocalizationString);
  }
}
