export interface NotificationSaveData<P = any>
{
  id: number;
  templateKey: string;
  turn: number;
  involvedPlayerIds: number[];
  locationId: number | undefined;

  props: P;
}
