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

class WarDeclarationNotification extends React.Component<PropTypes, {}>
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
        localize("warDeclarationText")(
        {
          aggressorName: notification.props.aggressor.name.toString(),
          defenderName: notification.props.defender.name.toString(),
        }),
      )
    );
  }
}

const factory = React.createFactory(WarDeclarationNotification);
export default factory;
