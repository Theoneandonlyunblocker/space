import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import {eventManager} from "core/src/app/eventManager";
import {options} from "core/src/app/Options";
import {OptionsGroup, OptionsGroupItem} from "./OptionsGroup";
import {OptionsCheckbox} from "./OptionsCheckbox";
import {NotificationFilterButton} from "../notifications/NotificationFilterButton";
import {tutorialStatus} from "core/src/tutorials/TutorialStatus";
import { Language } from "core/src/localization/Language";
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
  public override state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public override render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "display-options",
      },
        OptionsGroup(
        {
          key: "language",
          headerTitle: localize("language").toString(),
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
          headerTitle: localize("ui").toString(),
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
          label: localize("alwaysExpandTopRightMenuOnLowResolution").toString(),
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
          text: localize("messageSettings").toString(),
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
          localize("resetTutorials").toString(),
        ),
      }
    ]);
  }
}

// tslint:disable-next-line:variable-name
export const DisplayOptions: React.Factory<PropTypes> = React.createFactory(DisplayOptionsComponent);
