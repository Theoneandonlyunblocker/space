import ListOrder from "./ListOrder";
import ListItem from "./ListItem";

declare interface ListColumn
{
  key: string;
  label: string;
  title?: string;
  
  defaultOrder: ListOrder;
  notSortable?: boolean;                                  // if true sort by VVVV
  sortingFunction?: (a: ListItem, b: ListItem) => number; // sortingFunction(a, b)
  propToSortBy?: string;                                  // sort(a.data[propToSortBy], b.data[propToSortBy])
                                                          // sort(a.key, b.key)
}

export default ListColumn;
