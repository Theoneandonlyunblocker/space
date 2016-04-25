import ListOrder from "./ListOrder";

declare interface ListColumn
{
  key: string;
  label: string;
  title?: string;
  
  defaultOrder: ListOrder;
  sortingFunction?: <T>(a: T, b: T) => number;
}

export default ListColumn;
