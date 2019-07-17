import * as React from "react";

import {app} from "../../../../src/App"; // TODO global
import {activeModuleData} from "../../../../src/activeModuleData";
import {Options} from "../../../../src/Options";
import {Language} from "../../../../src/localization/Language";
import
{
  getLanguagesByCodeFromGameModules,
  getLanguageSupportLevelForGameModules,
} from "../../../../src/localization/languageSupport";

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
    return(
      LanguageSelect(
      {
        activeLanguage: this.props.activeLanguage,
        availableLanguagesByCode: getLanguagesByCodeFromGameModules(...activeModuleData.gameModules),
        languageSupportLevelByCode: getLanguageSupportLevelForGameModules(...activeModuleData.gameModules),
        onChange: this.handleLanguageChange,
      })
    );
  }

  private handleLanguageChange(newLanguage: Language): void
  {
    Options.display.language = newLanguage;
    Options.save();

    if (this.props.onChange)
    {
      this.props.onChange();
    }

    app.reactUI.render();
  }
}

export const AppLanguageSelect: React.Factory<PropTypes> = React.createFactory(AppLanguageSelectComponent);
