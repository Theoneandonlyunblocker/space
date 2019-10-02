import { ResourceTemplate } from "../templateinterfaces/ResourceTemplate";


export enum TradeableItemType
{
  Resource,
}
export interface TradeableItem
{
  key: string;
  type: TradeableItemType;
  amount: number;
}
export interface TradeableResource
{
  key: string;
  type: TradeableItemType.Resource;
  amount: number;
  resource: ResourceTemplate;
}
