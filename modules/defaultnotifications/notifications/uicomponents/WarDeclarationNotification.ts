import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";

import {Notification} from "../../../../src/notifications/Notification";

import
{
  PropTypes as NotificationProps,
  SerializedPropTypes as SerializedNotificationProps,
} from "../warDeclarationNotification";


interface PropTypes
{
  notification: Notification<NotificationProps, SerializedNotificationProps>;
}

class WarDeclarationNotificationComponent extends React.Component<PropTypes, {}>
{
  public displayName = "WarDeclarationNotification";

  constructor(props: PropTypes)
  {
    super(props);
  }

  public render()
  {
    const notification = this.props.notification;

    return(
      ReactDOMElements.div(
      {
        className: "war-declaration-notification",
      },
        localize("warDeclarationText").format(
        {
          aggressorName: notification.props.aggressor.name,
          defenderName: notification.props.defender.name,
        }),
      )
    );
  }
}

export const WarDeclarationNotification = React.createFactory(WarDeclarationNotificationComponent);
