/// <reference path="../../../../lib/react-global.d.ts" />

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
  displayName = "PlayerDiedNotification";

  constructor(props: PropTypes)
  {
    super(props);
  }

  public render()
  {
    var notification = this.props.notification;

    return(
      React.DOM.div(
      {
        className: "player-died-notification",
      },
        "Here lies " + notification.props.deadPlayerName + ".",
        React.DOM.br(null),
        React.DOM.br(null),
        "He never scored.",
      )
    );
  }
}

const Factory = React.createFactory(PlayerDiedNotification);
export default Factory;
