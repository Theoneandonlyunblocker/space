import { EditableLanguageSpecificTagInputData, EditableLanguageSpecificTagSelectData } from "./EditableLanguageSpecificTagData";
import { EnglishName } from "../EnglishName";


const strings =
{
  notPlural: "was",
  plural: "were",
};

export const englishNameTagsData =
{
  isPlural: <EditableLanguageSpecificTagSelectData<EnglishName>>
  {
    type: "select",
    getDisplayedText: (name) =>
    {
      return name.languageSpecificTags.isPlural ? strings.plural : strings.notPlural;
    },
    onChange: (name, value) => name.customize(name.baseName, {isPlural: value === strings.plural}),
    choices:
    [
      {
        displayedText: strings.notPlural,
      },
      {
        displayedText: strings.plural,
      },
    ],
  },
  thirdPersonPronoun: <EditableLanguageSpecificTagInputData<EnglishName>>
  {
    type: "input",
    getDisplayedText: name => name.languageSpecificTags.pronouns.thirdPerson,
    onChange: (name, value) =>
    {
      name.hasBeenCustomized = true;
      name.languageSpecificTags.pronouns.thirdPerson = value;
    },
  },
  baseName: <EditableLanguageSpecificTagInputData<EnglishName>>
  {
    type: "input",
    getDisplayedText: name => name.baseName,
    onChange: (name, value) => name.customize(value),
  }
};
