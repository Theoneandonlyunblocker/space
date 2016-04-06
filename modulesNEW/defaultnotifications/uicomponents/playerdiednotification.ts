/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

import Notification from "../../../src/Notification.ts";

import {PropTypes as NotificationProps} from "../playerDiedNotification.ts";


interface PropTypes
{
  notification: Notification<NotificationProps>;
}

class PlayerDiedNotification extends React.Component<PropTypes, {}>
{
  private displayName: string = "PlayerDiedNotification";
  
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
        className: "player-died-notification draggable-container"
      },
        "Here lies " + notification.props.deadPlayerName + ".",
        React.DOM.br(null),
        React.DOM.br(null),
        "He never scored."
      )
    );
  }
}

const Factory = React.createFactory(PlayerDiedNotification);
export default Factory;
