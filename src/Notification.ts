import NotificationSaveData from "./savedata/NotificationSaveData";
import NotificationTemplate from "./templateinterfaces/NotificationTemplate";

export default class Notification<P>
{
  template: NotificationTemplate;
  props: P;
  turn: number;

  hasBeenRead: boolean = false;

  constructor(template: NotificationTemplate, props: P, turn: number)
  {
    this.template = template;
    this.props = props;
    this.turn = turn;
  }
  public makeMessage(): string
  {
    return this.template.messageConstructor(this.props);
  }
  public getTitle(): string
  {
    return this.template.getTitle(this.props);
  }
  public serialize(): NotificationSaveData
  {
    const data: NotificationSaveData =
    {
      templateKey: this.template.key,
      hasBeenRead: this.hasBeenRead,
      turn: this.turn,

      props: this.template.serializeProps(this.props),
    };


    return data;
  }
}
