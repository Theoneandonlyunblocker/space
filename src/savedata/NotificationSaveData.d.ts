declare interface NotificationSaveData<P>
{
  id: number;
  templateKey: string;
  hasBeenRead: boolean;
  turn: number;
  involvedPlayerIds: number[];
  witnessingPlayerIds: number[];

  props: P;
}

export default NotificationSaveData;
