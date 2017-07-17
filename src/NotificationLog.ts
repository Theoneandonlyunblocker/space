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


export default class NotificationLog
{
  public readonly notifications: Notification<any, any>[] = [];
  public notificationFilter: NotificationFilter;
  public currentTurn: number;

  constructor()
  {
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
    // TODO 2017.07.17 | this seems stupid & unnecessary
    // if (this.isHumanTurn)
    // {
    //   eventManager.dispatchEvent("updateNotificationLog");
    // }
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
      case NotificationWitnessCriterion.always:
      {
        return true;
      }
      case NotificationWitnessCriterion.isInvolved:
      {
        return involvedPlayers.indexOf(witnessingPlayer) !== -1;
      }
      case NotificationWitnessCriterion.metOneInvolvedPlayer:
      {
        return involvedPlayers.some(involvedPlayer =>
        {
          return Boolean(witnessingPlayer.diplomacyStatus.metPlayers[involvedPlayer.id]);
        });
      }
      case NotificationWitnessCriterion.metAllInvolvedPlayers:
      {
        return involvedPlayers.every(involvedPlayer =>
        {
          return Boolean(witnessingPlayer.diplomacyStatus.metPlayers[involvedPlayer.id]);
        });
      }
      case NotificationWitnessCriterion.locationIsRevealed:
      {
        return witnessingPlayer.starIsRevealed(location);
      }
      case NotificationWitnessCriterion.locationIsVisible:
      {
        return witnessingPlayer.starIsVisible(location);
      }
      case NotificationWitnessCriterion.locationIsDetected:
      {
        return witnessingPlayer.starIsDetected(location);
      }
    }
  }
}
