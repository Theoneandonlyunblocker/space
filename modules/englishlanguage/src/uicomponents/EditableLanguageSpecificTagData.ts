import { Name } from "core/src/localization/Name";


export type EditableLanguageSpecificTagInputData<N extends Name = Name> =
{
  type: "input";
  getDisplayedText: (name: N) => string;
  onChange: (name: N, value: string) => void;
};
export type EditableLanguageSpecificTagSelectData<N extends Name = Name> =
{
  type: "select";
  getDisplayedText: (name: N) => string;
  onChange: (name: N, value: string) => void;
  choices:
  {
    displayedText: string;
  }[];
};
export type EditableLanguageSpecificTagData<N extends Name = Name> =
  EditableLanguageSpecificTagInputData<N> |
  EditableLanguageSpecificTagSelectData<N>;
