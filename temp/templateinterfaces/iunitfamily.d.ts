declare interface IUnitFamily extends IDistributable
{
  type: string;
  debugOnly: boolean;
  alwaysAvailable: boolean;
  
  associatedTemplates?: IUnitTemplate[]; //set dynamically
}
