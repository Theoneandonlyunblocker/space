import NotificationTemplate from "./templateinterfaces/NotificationTemplate.d.ts";
import NotificationSaveData from "./savedata/NotificationSaveData.d.ts";

export default class Notification
{
  template: NotificationTemplate;
  props: any;
  turn: number;

  hasBeenRead: boolean = false;

  constructor(template: NotificationTemplate, props: any, turn: number)
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
