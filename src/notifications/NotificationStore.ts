import NotificationTemplate from "../templateinterfaces/NotificationTemplate";

import NotificationStoreSaveData from "../savedata/NotificationStoreSaveData";

import Player from "../Player";
import Star from "../Star";

import {Notification} from "./Notification";


export class NotificationStore
{
  public currentTurn: number;
  public readonly onNewNotification: ((notification: Notification) => void)[] = [];
  public readonly notificationsById: {[id: number]: Notification} = {};

  constructor()
  {
  }

  public makeNotification<P, D>(args:
  {
    template: NotificationTemplate<P, D>;
    props: P;
    involvedPlayers: Player[];
    location: Star | null;
  })
  {
    const notification = new Notification(
    {
      id: undefined,
      template: args.template,
      props: args.props,
      involvedPlayers: args.involvedPlayers,
      location: args.location,
      turn: this.currentTurn,
    });

    this.notificationsById[notification.id] = notification;
    this.onNewNotification.forEach(listenerFN =>
    {
      listenerFN(notification);
    });
  }

  public serialize(): NotificationStoreSaveData
  {
    return(
    {
      notifications: Object.keys(this.notificationsById).map(id =>
      {
        return this.notificationsById[id].serialize();
      }),
    });
  }
}
