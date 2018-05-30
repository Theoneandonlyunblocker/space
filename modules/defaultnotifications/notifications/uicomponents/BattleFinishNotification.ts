import * as React from "react";

import {Notification} from "../../../../src/notifications/Notification";

import {localize} from "../../localization/localize";

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
  public displayName = "BattleFinishNotification";

  constructor(props: PropTypes)
  {
    super(props);
  }

  public render()
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
      React.DOM.div(
      {
        className: "battle-finish-notification",
      },
        localize(messageToLocalize)(
        {
          attackerName: attacker.name.toString(),
          defenderName: defender.name.toString(),
          locationName: location.name.toString(),
        }),
      )
    );
  }
}

const factory = React.createFactory(BattleFinishNotification);
export default factory;
