import NotificationTemplate from "./templateinterfaces/NotificationTemplate";

import NotificationLogSaveData from "./savedata/NotificationLogSaveData";

import Notification from "./Notification";
import NotificationFilter from "./NotificationFilter";
import {NotificationWitnessCriteria} from "./NotificationWitnessCriteria";
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
    location?: Star,
  })
  {
    const notification = new Notification(
    {
      template: args.template,
      props: args.props,
      involvedPlayers: args.involvedPlayers,

      witnessingPlayers: this.getWitnessingPlayers(
        args.involvedPlayers,
        args.location,
        args.template.witnessCriteria,
      ),
      turn: this.currentTurn,
    });

    this.addNotification(notification);
    // TODO 2017.07.17 | this seems stupid & unnecessary
    // if (this.isHumanTurn)
    // {
    //   eventManager.dispatchEvent("updateNotificationLog");
    // }
  }
  // TODO 2017.07.17 | seems unnecessary
  public addNotification(notification: Notification<any, any>)
  {
    this.notifications.push(notification);
  }
  // TODO 2017.07.17 | seems unnecessary
  public getUnreadNotificationsForTurn(turn: number)
  {
    return this.notifications.filter(notification =>
    {
      return !notification.hasBeenRead && notification.turn === turn;
    });
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
    involvedPlayers: Player[],
    location: Star | undefined,
    witnessCriteria: NotificationWitnessCriteria[],
  ): Player[]
  {
    // TODO 2017.07.17 | implement
    return this.subscribedPlayers.filter(player =>
    {

    });
  }
}
