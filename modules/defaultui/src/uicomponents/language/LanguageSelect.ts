import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Language} from "core/src/localization/Language";
import {LanguageSupportLevel} from "core/src/localization/languageSupport";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  activeLanguage: Language;
  availableLanguagesByCode: {[languageCode: string]: Language};
  languageSupportLevelByCode: {[languageCode: string]: LanguageSupportLevel};
  onChange: (newLanguage: Language) => void;
}

interface StateType
{
}

export class LanguageSelectComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "LanguageSelect";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.handleLanguageChange = this.handleLanguageChange.bind(this);
  }

  public render()
  {
    const sortedLanguages = Object.keys(this.props.availableLanguagesByCode).map(code =>
    {
      return this.props.availableLanguagesByCode[code];
    }).sort((a, b) =>
    {
      const aSupportLevel = this.props.languageSupportLevelByCode[a.code];
      const bSupportLevel = this.props.languageSupportLevelByCode[b.code];

      const supportLevelSort = bSupportLevel - aSupportLevel;
      if (supportLevelSort)
      {
        return supportLevelSort;
      }

      else
      {
        return a.displayName.localeCompare(b.displayName);
      }
    });

    const languageOptionElements = sortedLanguages.map(language =>
    {
      const supportLevel = this.props.languageSupportLevelByCode[language.code];

      return ReactDOMElements.option(
      {
        className: "language-select-option" + (supportLevel === LanguageSupportLevel.Full ?
          " full-language-support" :
          " partial-language-support"),
        value: language.code,
        key: language.code,
        title: supportLevel === LanguageSupportLevel.Full ?
          localize("fullLanguageSupport").toString() :
          localize("partialLanguageSupport").toString(),
      },
        language.displayName,
      );
    });

    return(
      ReactDOMElements.select(
      {
        className: "language-select",
        value: this.props.activeLanguage.code,
        onChange: this.handleLanguageChange,
      },
        languageOptionElements,
      )
    );
  }

  private handleLanguageChange(e: React.FormEvent<HTMLSelectElement>): void
  {
    const target = e.currentTarget;
    const selectedLanguageCode = target.value;
    const newLanguage = this.props.availableLanguagesByCode[selectedLanguageCode];

    if (!newLanguage)
    {
      throw new Error(`Couldn't select language with code ${selectedLanguageCode}.
        Valid languages: ${Object.keys(this.props.availableLanguagesByCode)}`);
    }

    this.props.onChange(newLanguage);
  }
}

export const LanguageSelect: React.Factory<PropTypes> = React.createFactory(LanguageSelectComponent);
