import * as React from "react";

import {app} from "../../../../src/app/App"; // TODO global
import {activeModuleData} from "../../../../src/app/activeModuleData";
import {options} from "../../../../src/app/Options";
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
