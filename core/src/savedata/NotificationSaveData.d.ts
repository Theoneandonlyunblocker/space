export interface NotificationSaveData<P = any>
{
  id: number;
  template: string;
  turn: number;
  involvedPlayerIds: number[];
  locationId: number | undefined;

  props: P;
}
