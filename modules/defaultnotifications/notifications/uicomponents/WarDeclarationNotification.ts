/// <reference path="../../../../lib/react-global.d.ts" />

import Notification from "../../../../src/Notification";

import {PropTypes as NotificationProps} from "../warDeclarationNotification";


interface PropTypes
{
  notification: Notification<NotificationProps>;
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
    // TODO
    return(
      React.DOM.div(
      {
        className: "war-declaration-notification draggable-container"
      },
        `${p.player1.name} declared war on ${p.player2.name}.`
      )
    );
  }
}

const Factory = React.createFactory(WarDeclarationNotification);
export default Factory;
