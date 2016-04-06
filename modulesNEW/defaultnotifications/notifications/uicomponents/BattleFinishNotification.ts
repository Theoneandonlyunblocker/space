/// <reference path="../../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

import Notification from "../../../../src/Notification.ts";

import {PropTypes as NotificationProps} from "../battleFinishNotification.ts";


interface PropTypes
{
  notification: Notification<NotificationProps>;
}

class BattleFinishNotification extends React.Component<PropTypes, {}>
{
  private displayName: string = "BattleFinishNotification";

  constructor(props: PropTypes)
  {
    super(props);
  }
  
  public render()
  {
    var notification = this.props.notification;
    var p = notification.props;
    var attacker = p.attacker;
    var defender = p.defender;
    var victor = p.victor;
    var location = p.location;

    var message = notification.makeMessage();

    var attackSuccessString = victor === attacker ? " succesfully " : " unsuccesfully ";
    var attackerGainedControl = location.owner === attacker;
    var controllerString = attackerGainedControl ? " now controls " :
      " maintains control of ";

    return(
      React.DOM.div(
      {
        className: "battle-finish-notification draggable-container"
      },
        message + ".",
        React.DOM.br(null),
        React.DOM.br(null),
        "" + attacker.name + attackSuccessString + "attacked " + defender.name + " in " +
          location.name + ". " + victor.name + controllerString + location.name + "."
      )
    );
  }
}

const Factory = React.createFactory(BattleFinishNotification);
export default Factory;
