import {Language} from "src/localization/Language";
import { EnglishName, EnglishNameTags } from "./EnglishName";


export const englishLanguage: Language<EnglishName> =
{
  code: "en",
  displayName: "English",
  constructName: (name: string, tags: EnglishNameTags) => new EnglishName(name, tags),
};
