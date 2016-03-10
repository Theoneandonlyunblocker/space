/// <reference path="templateinterfaces/inotificationtemplate.d.ts" />
/// <reference path="savedata/inotificationsavedata.d.ts" />

module Rance
{
  export class Notification
  {
    template: Templates.INotificationTemplate;
    props: any;
    turn: number;

    hasBeenRead: boolean = false;

    constructor(template: Templates.INotificationTemplate, props: any, turn: number)
    {
      this.template = template;
      this.props = props;
      this.turn = turn;
    }
    makeMessage()
    {
      return this.template.messageConstructor(this.props);
    }
    serialize(): INotificationSaveData
    {
      var data: INotificationSaveData =
      {
        templateKey: this.template.key,
        hasBeenRead: this.hasBeenRead,
        turn: this.turn,

        props: this.template.serializeProps(this.props)
      };


      return data;
    }
  }
}
