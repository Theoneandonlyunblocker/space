import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";

import {Notification} from "core/notifications/Notification";

import
{
  PropTypes as NotificationProps,
  SerializedPropTypes as SerializedNotificationProps,
} from "../playerDiedNotification";


interface PropTypes
{
  notification: Notification<NotificationProps, SerializedNotificationProps>;
}

class PlayerDiedNotificationComponent extends React.Component<PropTypes, {}>
{
  public displayName = "PlayerDiedNotification";

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
        className: "player-died-notification",
      },
        localize("playerDiedTextTop").format(
        {
          playerName: notification.props.player.name,
        }),
        ReactDOMElements.br(null),
        ReactDOMElements.br(null),
        localize("playerDiedTextBottom").format(
        {
          playerName: notification.props.player.name,
        }),
      )
    );
  }
}

export const PlayerDiedNotification = React.createFactory(PlayerDiedNotificationComponent);
