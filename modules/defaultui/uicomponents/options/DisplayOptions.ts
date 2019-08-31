import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import {eventManager} from "../../../../src/app/eventManager";
import {options} from "../../../../src/app/Options";
import {OptionsGroup, OptionsGroupItem} from "./OptionsGroup";
import {OptionsCheckbox} from "./OptionsCheckbox";
import {NotificationFilterButton} from "../notifications/NotificationFilterButton";
import {tutorialStatus} from "../../../../src/tutorials/TutorialStatus";
import { Language } from "../../../../src/localization/Language";
import {AppLanguageSelect} from "../language/AppLanguageSelect";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
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
            options.setDefaultForCategory("display");
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
          isChecked: options.display.noHamburger,
          label: localize("alwaysExpandTopRightMenuOnLowResolution")(),
          onChangeFN: () =>
          {
            options.display.noHamburger = !options.display.noHamburger;
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
          onClick: tutorialStatus.reset,
        },
          localize("resetTutorials")(),
        ),
      }
    ]);
  }
}

// tslint:disable-next-line:variable-name
export const DisplayOptions: React.Factory<PropTypes> = React.createFactory(DisplayOptionsComponent);
