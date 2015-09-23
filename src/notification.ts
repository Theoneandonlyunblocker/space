/// <reference path="templateinterfaces/inotificationtemplate.d.ts" />

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
    serialize()
    {
      var data: any = {};

      data.templateKey = this.template.key;
      data.hasBeenRead = this.hasBeenRead;
      data.turn = this.turn;

      data.props = this.template.serializeProps(this.props);

      return data;
    }
  }
}
