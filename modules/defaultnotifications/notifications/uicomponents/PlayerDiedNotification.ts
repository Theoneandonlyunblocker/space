import * as React from "react";

import {localize} from "../../localization/localize";

import Notification from "../../../../src/Notification";

import
{
  PropTypes as NotificationProps,
  SerializedPropTypes as SerializedNotificationProps,
} from "../playerDiedNotification";


interface PropTypes
{
  notification: Notification<NotificationProps, SerializedNotificationProps>;
}

class PlayerDiedNotification extends React.Component<PropTypes, {}>
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
      React.DOM.div(
      {
        className: "player-died-notification",
      },
        localizeF("playerDiedTextTop").format(
        {
          playerName: notification.props.deadPlayerName,
        }),
        React.DOM.br(null),
        React.DOM.br(null),
        localizeF("playerDiedTextBottom").format(
        {
          playerPronoun: "He", // TODO 2017.10.14 | need to do this stuff better
        }),
      )
    );
  }
}

// tslint:disable-next-line:variable-name
const Factory = React.createFactory(PlayerDiedNotification);
export default Factory;
