/// <reference path="../../../../lib/react-global.d.ts" />

import Notification from "../../../../src/Notification";

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
  displayName = "WarDeclarationNotification";

  constructor(props: PropTypes)
  {
    super(props);
  }

  public render()
  {
    var notification = this.props.notification;
    var p = notification.props;

    return(
      React.DOM.div(
      {
        className: "war-declaration-notification",
      },
        `${p.aggressor.name} declared war on ${p.defender.name}.`,
      )
    );
  }
}

const Factory = React.createFactory(WarDeclarationNotification);
export default Factory;
