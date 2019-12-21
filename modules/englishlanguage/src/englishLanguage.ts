import {Language} from "core/src/localization/Language";
import { EnglishName, EnglishNameTags } from "./EnglishName";
import { EnglishPlayerNameEditor } from "./uicomponents/EnglishPlayerNameEditor";


export const englishLanguage: Language<EnglishName> =
{
  code: "en",
  displayName: "English",
  constructName: (name: string, tags: EnglishNameTags) => new EnglishName(name, tags),
  renderNameEditor:
  {
    player: EnglishPlayerNameEditor,
  },
};
