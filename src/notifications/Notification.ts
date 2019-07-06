import {NotificationSaveData} from "../savedata/NotificationSaveData";

import {NotificationTemplate} from "../templateinterfaces/NotificationTemplate";

import {Player} from "../Player";
import {Star} from "../Star";
import {idGenerators} from "../idGenerators";


export class Notification<P = any, D = any>
{
  public readonly id: number;
  public readonly template: NotificationTemplate<P, D>;
  props: P;
  turn: number;
  public readonly involvedPlayers: Player[];
  public readonly location: Star | undefined;

  constructor(args:
  {
    id: number | undefined;
    template: NotificationTemplate<P, D>;
    props: P;
    turn: number;
    involvedPlayers: Player[];
    location: Star | undefined;
  })
  {
    this.id = isFinite(args.id) ? args.id : idGenerators.notification++;
    this.template = args.template;
    this.props = args.props;
    this.turn = args.turn;
    this.involvedPlayers = args.involvedPlayers;
    this.location = args.location;
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
      id: this.id,
      templateKey: this.template.key,
      turn: this.turn,
      involvedPlayerIds: this.involvedPlayers.map(player => player.id),
      locationId: this.location ? this.location.id : undefined,

      props: this.template.serializeProps(this.props),
    };

    return data;
  }
}
