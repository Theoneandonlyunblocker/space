import NotificationTemplate from "./templateinterfaces/NotificationTemplate";
import NotificationSaveData from "./savedata/NotificationSaveData";

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
  makeMessage()
  {
    return this.template.messageConstructor(this.props);
  }
  serialize(): NotificationSaveData
  {
    var data: NotificationSaveData =
    {
      templateKey: this.template.key,
      hasBeenRead: this.hasBeenRead,
      turn: this.turn,

      props: this.template.serializeProps(this.props)
    };


    return data;
  }
}
