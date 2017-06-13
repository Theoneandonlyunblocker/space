/// <reference path="../../../lib/react-global.d.ts" />

import {default as LanguageSelect} from "./LanguageSelect";

import app from "../../App"; // TODO global

import {Language} from "../../localization/Language";
import
{
  getActiveLanguage,
  setActiveLanguageCode,
} from "../../localization/activeLanguage";
import
{
  getLanguagesByCode,
  getLanguageSupportLevelForModuleFiles,
} from "../../localization/languageSupport";

interface PropTypes extends React.Props<any>
{
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
        activeLanguage: getActiveLanguage(),
        availableLanguagesByCode: getLanguagesByCode(...app.moduleData.moduleFiles),
        languageSupportLevelByCode: getLanguageSupportLevelForModuleFiles(...app.moduleData.moduleFiles),
        onChange: this.handleLanguageChange,
      })
    );
  }

  private handleLanguageChange(newLanguage: Language): void
  {
    setActiveLanguageCode(newLanguage.code);
    // TODO 13.06.2017 | need some way to trigger ui update here
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(AppLanguageSelectComponent);
export default Factory;
