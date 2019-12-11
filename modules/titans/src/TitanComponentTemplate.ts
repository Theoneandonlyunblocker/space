import { ItemTemplate } from "core/src/templateinterfaces/ItemTemplate";


export interface TitanComponentTemplate extends ItemTemplate
{
  isLockedToUnit: true;
}

export type TitanComponentTemplatesBySlot =
{
  [itemSlot: string]: TitanComponentTemplate[];
};
