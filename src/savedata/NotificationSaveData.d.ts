declare interface NotificationSaveData<P>
{
  templateKey: string;
  hasBeenRead: boolean;
  turn: number;
  involvedPlayerIds: number[];
  witnessingPlayerIds: number[];

  props: P;
}

export default NotificationSaveData;
