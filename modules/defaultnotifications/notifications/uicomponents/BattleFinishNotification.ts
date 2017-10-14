import * as React from "react";

import Notification from "../../../../src/Notification";

import {localizeF} from "../../localization/localize";

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
    const notification = this.props.notification;
    const attacker = notification.props.attacker;
    const defender = notification.props.defender;
    const victor = notification.props.victor;
    const location = notification.props.location;

    const attackWasSuccessful = victor === attacker;
    const attackerGainedControl = location.owner === attacker;

    const messageToLocalize = attackWasSuccessful ?
      attackerGainedControl ?
        "battleFinishText_locationConquered" :
        "battleFinishText_attackerWon" :
      "battleFinishText_attackerLost";

    return(
      React.DOM.div(
      {
        className: "battle-finish-notification",
      },
        localizeF(messageToLocalize).format(
        {
          attackerName: attacker.name.toString(),
          defenderName: defender.name.toString(),
          locationName: location.name.toString(),
        }),
      )
    );
  }
}

const Factory = React.createFactory(BattleFinishNotification);
export default Factory;
