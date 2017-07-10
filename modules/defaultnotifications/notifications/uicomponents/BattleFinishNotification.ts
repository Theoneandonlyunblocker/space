/// <reference path="../../../../lib/react-global.d.ts" />

import Notification from "../../../../src/Notification";


import
{
  PropTypes as NotificationProps,
  SerializedPropTypes as SerializedNotificationProps,
} from "../battleFinishNotification";


interface PropTypes
{
  notification: Notification<NotificationProps, SerializedNotificationProps>;
}

class BattleFinishNotification extends React.Component<PropTypes, {}>
{
  displayName = "BattleFinishNotification";

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

    var attackerGainedControl = location.owner === attacker;

    var message = notification.makeMessage();

    var attackSuccessString = victor === attacker ?
      " succesfully " :
      " unsuccesfully ";
    var controllerString = attackerGainedControl ?
      ` now ${victor.name.pluralizeVerbWithS("control")} ` :
      ` ${victor.name.pluralizeVerbWithS("maintain")} control of `;

    return(
      React.DOM.div(
      {
        className: "battle-finish-notification draggable",
      },
        message + ".",
        React.DOM.br(null),
        React.DOM.br(null),
        "" + attacker.name + attackSuccessString + "attacked " + defender.name + " in " +
          location.name + ". " + victor.name + controllerString + location.name + ".",
      )
    );
  }
}

const Factory = React.createFactory(BattleFinishNotification);
export default Factory;
