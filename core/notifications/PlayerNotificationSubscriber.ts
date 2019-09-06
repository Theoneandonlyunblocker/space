import {Player} from "../player/Player";
import {Star} from "../map/Star";

import {Notification} from "./Notification";
import {NotificationSubscriber} from "./NotificationSubscriber";
import {NotificationWitnessCriterion} from "./NotificationWitnessCriterion";


function witnessCriterionIsSatisfied(
  witnessingPlayer: Player,
  criterion: NotificationWitnessCriterion,
  involvedPlayers: Player[],
  location: Star | undefined,
): boolean
{
  switch (criterion)
  {
    case NotificationWitnessCriterion.Always:
    {
      return true;
    }
    case NotificationWitnessCriterion.IsInvolved:
    {
      return involvedPlayers.some(involvedPlayer => witnessingPlayer === involvedPlayer);
    }
    case NotificationWitnessCriterion.MetOneInvolvedPlayer:
    {
      return involvedPlayers.some(involvedPlayer => witnessingPlayer.diplomacy.hasMetPlayer(involvedPlayer));
    }
    case NotificationWitnessCriterion.MetAllInvolvedPlayers:
    {
      return involvedPlayers.every(involvedPlayer => witnessingPlayer.diplomacy.hasMetPlayer(involvedPlayer));
    }
    case NotificationWitnessCriterion.LocationIsRevealed:
    {
      return witnessingPlayer.starIsRevealed(location);
    }
    case NotificationWitnessCriterion.LocationIsVisible:
    {
      return witnessingPlayer.starIsVisible(location);
    }
    case NotificationWitnessCriterion.LocationIsDetected:
    {
      return witnessingPlayer.starIsDetected(location);
    }
  }
}

function playerDidWitnessEvent(
  player: Player,
  notification: Notification,
)
{
  const witnessCriteria = notification.template.witnessCriteria;

  const oneCriteriaGroupIsSatisfied = witnessCriteria.some(criteriaGroup =>
  {
    const allCriteriaInGroupAreSatisfied = criteriaGroup.every(criterion =>
    {
      return witnessCriterionIsSatisfied(
        player,
        criterion,
        notification.involvedPlayers,
        notification.location,
      );
    });

    return allCriteriaInGroupAreSatisfied;
  });

  return oneCriteriaGroupIsSatisfied;
}


export class PlayerNotificationSubscriber extends NotificationSubscriber
{
  constructor(player: Player)
  {
    super(playerDidWitnessEvent.bind(null, player));
  }
}

