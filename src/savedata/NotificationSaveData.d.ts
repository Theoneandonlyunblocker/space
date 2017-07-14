declare interface NotificationSaveData<P>
{
  templateKey: string;
  hasBeenRead: boolean;
  turn: number;
  involvedPlayerIds: number[];

  props: P;
}

export default NotificationSaveData;
