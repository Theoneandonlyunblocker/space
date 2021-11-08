import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Notification} from "core/src/notifications/Notification";

import {localize} from "../../../localization/localize";

import
{
  PropTypes as NotificationProps,
  SerializedPropTypes as SerializedNotificationProps,
} from "../battleFinishNotification";


interface PropTypes
{
  notification: Notification<NotificationProps, SerializedNotificationProps>;
}

class BattleFinishNotificationComponent extends React.Component<PropTypes, {}>
{
  public displayName = "BattleFinishNotification";

  constructor(props: PropTypes)
  {
    super(props);
  }

  public override render()
  {
    const notification = this.props.notification;
    const location = notification.props.location;
    const attacker = notification.props.attacker;
    const defender = notification.props.defender;
    const victor = notification.props.victor;
    const newController = notification.props.newController;

    const attackWasSuccessful = victor === attacker;
    const attackerGainedControl = newController === attacker;

    const messageToLocalize = attackWasSuccessful ?
      attackerGainedControl ?
        "battleFinishText_locationConquered" :
        "battleFinishText_attackerWon" :
      "battleFinishText_attackerLost";

    return(
      ReactDOMElements.div(
      {
        className: "battle-finish-notification",
      },
        localize(messageToLocalize).format(
        {
          attackerName: attacker.name,
          defenderName: defender.name,
          locationName: location.name.toString(),
        }),
      )
    );
  }
}

export const BattleFinishNotification = React.createFactory(BattleFinishNotificationComponent);
