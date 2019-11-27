import { ItemTemplate } from "core/src/templateinterfaces/ItemTemplate";


export type TitanComponentTemplate = ItemTemplate;

export type TitanComponentTemplatesBySlot =
{
  [itemSlot: string]: TitanComponentTemplate[];
};
