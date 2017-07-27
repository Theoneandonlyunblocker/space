import NotificationTemplate from "./templateinterfaces/NotificationTemplate";

import NotificationLogSaveData from "./savedata/NotificationLogSaveData";

import Notification from "./Notification";
import NotificationFilter from "./NotificationFilter";
import
{
  NotificationWitnessCriterion,
} from "./NotificationWitnessCriterion";
import Player from "./Player";
import Star from "./Star";
import eventManager from "./eventManager";


export default class NotificationLog
{
  public readonly notifications: Notification<any, any>[] = [];
  public notificationFilter: NotificationFilter;
  public currentTurn: number;

  private readonly subscribedPlayers: Player[] = [];

  constructor(subscribedPlayers: Player[])
  {
    this.subscribedPlayers.push(...subscribedPlayers);

    this.notificationFilter = new NotificationFilter();
  }
  public makeNotification<P, D>(args:
  {
    template: NotificationTemplate<P, D>,
    props: P,
    involvedPlayers: Player[],
    location: Star | null,
  })
  {
    const notification = new Notification(
    {
      template: args.template,
      props: args.props,
      involvedPlayers: args.involvedPlayers,

      witnessingPlayers: this.getWitnessingPlayers(
        args.template.witnessCriteria,
        args.involvedPlayers,
        args.location,
      ),
      turn: this.currentTurn,
    });

    this.notifications.push(notification);
    eventManager.dispatchEvent("updateNotificationLog");
  }
  // TODO 2017.07.17 | doesn't belong here
  public filterNotifications(notifications: Notification<any, any>[])
  {
    return notifications.filter(notification =>
    {
      return this.notificationFilter.shouldDisplayNotification(notification);
    });
  }
  public serialize(): NotificationLogSaveData
  {
    return(
    {
      notifications: this.notifications.map(notification => notification.serialize()),
    });
  }

  private getWitnessingPlayers(
    witnessCriteria: NotificationWitnessCriterion[][],
    involvedPlayers: Player[],
    location: Star | undefined,
  ): Player[]
  {
    return this.subscribedPlayers.filter(witnessingPlayer =>
    {
      const oneCriteriaGroupIsSatisfied = witnessCriteria.some(criteriaGroup =>
      {
        const allCriteriaInGroupAreSatisfied = criteriaGroup.every(criterion =>
        {
          const criterionIsSatisfied = this.witnessCriterionIsSatisfied(
            criterion,
            involvedPlayers,
            witnessingPlayer,
            location,
          );

          return criterionIsSatisfied;
        });

        return allCriteriaInGroupAreSatisfied;
      });

      return oneCriteriaGroupIsSatisfied;
    });
  }
  // TODO 2017.07.17 | does this belong in this class?
  private witnessCriterionIsSatisfied(
    criterion: NotificationWitnessCriterion,
    involvedPlayers: Player[],
    witnessingPlayer: Player,
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
        return involvedPlayers.indexOf(witnessingPlayer) !== -1;
      }
      case NotificationWitnessCriterion.MetOneInvolvedPlayer:
      {
        return involvedPlayers.some(involvedPlayer =>
        {
          return witnessingPlayer.diplomacyStatus.hasMetPlayer(involvedPlayer);
        });
      }
      case NotificationWitnessCriterion.MetAllInvolvedPlayers:
      {
        return involvedPlayers.every(involvedPlayer =>
        {
          return witnessingPlayer.diplomacyStatus.hasMetPlayer(involvedPlayer)
        });
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
}
