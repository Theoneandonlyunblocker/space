import NotificationSaveData from "./savedata/NotificationSaveData";

import NotificationTemplate from "./templateinterfaces/NotificationTemplate";

import {default as Player} from "./Player";

export default class Notification<P, D>
{
  template: NotificationTemplate<P, D>;
  props: P;
  turn: number;
  involvedPlayers: Player[];

  // TODO 2017.07.14 | should keep track of this per player if we want to allow multiple players
  hasBeenRead: boolean = false;

  constructor(args:
  {
    template: NotificationTemplate<P, D>,
    props: P,
    turn: number,
    involvedPlayers: Player[],
  })
  {
    this.template = args.template;
    this.props = args.props;
    this.turn = args.turn;
    this.involvedPlayers = args.involvedPlayers;
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
