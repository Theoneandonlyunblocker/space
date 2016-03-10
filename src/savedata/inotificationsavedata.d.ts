declare module Rance
{
  interface INotificationSaveData
  {
    templateKey: string;
    hasBeenRead: boolean;
    turn: number;

    props: any;
  }
}
