import * as React from "react";

import {localize} from "../../../localization/localize";
import {default as DefaultWindow} from "../windows/DefaultWindow";

import NotificationFilterList from "./NotificationFilterList";


export interface PropTypes extends React.Props<any>
{
  text: string;
  highlightedOptionKey?: string;
}

interface StateType
{
  hasNotificationFilterPopup: boolean;
}

export class NotificationFilterButtonComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "NotificationFilterButton";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      hasNotificationFilterPopup: false,
    };

    this.bindMethods();
  }

  public render()
  {
    return(
      React.DOM.div(
      {
        className: "notification-filter-button-container",
      },
        React.DOM.button(
        {
          className: "notification-filter-button",
          onClick: this.togglePopup,
        },
          this.props.text,
        ),
        !this.state.hasNotificationFilterPopup ? null :
          DefaultWindow(
          {
            title: localize("messageSettings")(),
            handleClose: this.closePopup,
          },
            NotificationFilterList(
            {
              highlightedOptionKey: this.props.highlightedOptionKey,
            }),
          ),
      )
    );
  }

  private bindMethods()
  {
    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
  }
  private openPopup(): void
  {
    this.setState(
    {
      hasNotificationFilterPopup: true,
    });
  }
  private closePopup(): void
  {
    this.setState(
    {
      hasNotificationFilterPopup: false,
    });
  }
  private togglePopup(): void
  {
    if (this.state.hasNotificationFilterPopup)
    {
      this.closePopup();
    }
    else
    {
      this.openPopup();
    }
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(NotificationFilterButtonComponent);
export default Factory;
