import NotificationSaveData from "./savedata/NotificationSaveData";

import NotificationTemplate from "./templateinterfaces/NotificationTemplate";

import {default as Player} from "./Player";

export default class Notification<P, D>
{
  template: NotificationTemplate<P, D>;
  props: P;
  turn: number;
  involvedPlayers: Player[];

  hasBeenRead: boolean = false;

  constructor(
    template: NotificationTemplate<P, D>,
    props: P,
    turn: number,
    involvedPlayers: Player[],
  )
  {
    this.template = template;
    this.props = props;
    this.turn = turn;
    this.involvedPlayers = involvedPlayers;
  }
  public makeMessage(): string
  {
    return this.template.messageConstructor(this.props);
  }
  public getTitle(): string
  {
    return this.template.getTitle(this.props);
  }
  public serialize(): NotificationSaveData<D>
  {
    const data: NotificationSaveData<D> =
    {
      templateKey: this.template.key,
      hasBeenRead: this.hasBeenRead,
      turn: this.turn,
      involvedPlayerIds: this.involvedPlayers.map(player => player.id),

      props: this.template.serializeProps(this.props),
    };

    return data;
  }
}
