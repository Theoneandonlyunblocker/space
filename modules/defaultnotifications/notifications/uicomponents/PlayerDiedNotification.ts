import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";

import {Notification} from "../../../../src/notifications/Notification";

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
      ReactDOMElements.div(
      {
        className: "player-died-notification",
      },
        localize("playerDiedTextTop")(
        {
          playerName: notification.props.deadPlayerName,
        }),
        ReactDOMElements.br(null),
        ReactDOMElements.br(null),
        localize("playerDiedTextBottom")(
        {
          playerPronoun: "He", // TODO 2017.10.14 | need to do this stuff better
        }),
      )
    );
  }
}

const factory = React.createFactory(PlayerDiedNotification);
export default factory;
