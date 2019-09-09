import * as React from "react";

import {app} from "core/src/app/App"; // TODO global
import {activeModuleData} from "core/src/app/activeModuleData";
import {options} from "core/src/app/Options";
import {Language} from "core/src/localization/Language";
import
{
  getLanguagesByCodeFromGameModules,
  getLanguageSupportLevelForGameModules,
  LanguageSupportLevel,
} from "core/src/localization/languageSupport";

import {LanguageSelect} from "./LanguageSelect";


export interface PropTypes extends React.Props<any>
{
  activeLanguage: Language;
  onChange?: () => void;
}

interface StateType
{
}

export class AppLanguageSelectComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "AppLanguageSelect";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.handleLanguageChange = this.handleLanguageChange.bind(this);
  }

  public render()
  {
    const availableLanguagesByCode = getLanguagesByCodeFromGameModules(...activeModuleData.gameModules);
    const languageSupportLevelByCode = getLanguageSupportLevelForGameModules(...activeModuleData.gameModules);

    if (options.debug.enabled)
    {
      availableLanguagesByCode["_"] =
      {
        code: "_",
        displayName: "empty",
        constructName: undefined,
      };
      languageSupportLevelByCode.empty = LanguageSupportLevel.None;
    }

    return(
      LanguageSelect(
      {
        activeLanguage: this.props.activeLanguage,
        availableLanguagesByCode: availableLanguagesByCode,
        languageSupportLevelByCode: languageSupportLevelByCode,
        onChange: this.handleLanguageChange,
      })
    );
  }

  private handleLanguageChange(newLanguage: Language): void
  {
    options.display.language = newLanguage;
    options.save();

    if (this.props.onChange)
    {
      this.props.onChange();
    }

    app.reactUI.render();
  }
}

export const AppLanguageSelect: React.Factory<PropTypes> = React.createFactory(AppLanguageSelectComponent);
