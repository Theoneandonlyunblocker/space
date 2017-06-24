/// <reference path="../../../lib/react-global.d.ts" />

import {Language} from "../../localization/Language";
import {LanguageSupportLevel} from "../../localization/languageSupport";

import {localize} from "../../../localization/options/localize";

interface PropTypes extends React.Props<any>
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

      return React.DOM.option(
      {
        className: "language-select-option" + (supportLevel === LanguageSupportLevel.full ?
          " full-language-support" :
          " partial-language-support"),
        value: language.code,
        key: language.code,
        title: supportLevel === LanguageSupportLevel.full ?
          localize("fullLanguageSupport").format() :
          localize("partialLanguageSupport").format(),
      },
        // TODO 13.06.2017 | add country flag
        language.displayName,
      );
    });

    return(
      React.DOM.select(
      {
        className: "language-select",
        value: this.props.activeLanguage.code,
        onChange: this.handleLanguageChange,
      },
        languageOptionElements,
      )
    );
  }

  private handleLanguageChange(e: React.FormEvent): void
  {
    const target = <HTMLInputElement> e.target;
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

const Factory: React.Factory<PropTypes> = React.createFactory(LanguageSelectComponent);
export default Factory;
