import * as React from "react";

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
      React.DOM.div(
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

// tslint:disable-next-line:variable-name
const Factory = React.createFactory(WarDeclarationNotification);
export default Factory;
