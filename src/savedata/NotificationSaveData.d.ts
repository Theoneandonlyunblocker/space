declare interface NotificationSaveData<P>
{
  templateKey: string;
  hasBeenRead: boolean;
  turn: number;

  props: P;
}

export default NotificationSaveData;
