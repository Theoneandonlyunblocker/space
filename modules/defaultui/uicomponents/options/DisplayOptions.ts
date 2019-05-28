import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import eventManager from "../../eventManager";
import Options from "../../Options";
import {default as OptionsGroup, OptionsGroupItem} from "./OptionsGroup";
import OptionsCheckbox from "./OptionsCheckbox";
import NotificationFilterButton from "../notifications/NotificationFilterButton";
import TutorialStatus from "../../tutorials/TutorialStatus";
import { Language } from "../../localization/Language";
import {default as AppLanguageSelect} from "../language/AppLanguageSelect";


// tslint:disable-next-line:no-any
interface PropTypes extends React.Props<any>
{
  activeLanguage: Language;
}

interface StateType
{
}

export class DisplayOptionsComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "DisplayOptions";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "display-options",
      },
        OptionsGroup(
        {
          key: "language",
          headerTitle: localize("language")(),
          options:
          [
            {
              key: "selectAppLanguage",
              content: AppLanguageSelect(
              {
                activeLanguage: this.props.activeLanguage,
              }),
            }
          ],
        }),
        OptionsGroup(
        {
          key: "ui",
          headerTitle: localize("ui")(),
          options: this.getUIOptions(),
          resetFN: () =>
          {
            Options.setDefaultForCategory("display");
            this.forceUpdate();
          },
        })
      )
    );
  }

  private getUIOptions(): OptionsGroupItem[]
  {
    return(
    [
      {
        key: "noHamburger",
        content: OptionsCheckbox(
        {
          isChecked: Options.display.noHamburger,
          label: localize("alwaysExpandTopRightMenuOnLowResolution")(),
          onChangeFN: () =>
          {
            Options.display.noHamburger = !Options.display.noHamburger;
            eventManager.dispatchEvent("updateHamburgerMenu");
            this.forceUpdate();
          },
        }),
      },
      {
        key: "notificationLogFilter",
        content: NotificationFilterButton(
        {
          text: localize("messageSettings")(),
          highlightedOptionKey: null,
        }),
      },
      {
        key: "resetTutorials",
        content: ReactDOMElements.button(
        {
          className: "reset-tutorials-button",
          onClick: TutorialStatus.reset,
        },
          localize("resetTutorials")(),
        ),
      }
    ]);
  }
}

// tslint:disable-next-line:variable-name
export const DisplayOptions: React.Factory<PropTypes> = React.createFactory(DisplayOptionsComponent);
