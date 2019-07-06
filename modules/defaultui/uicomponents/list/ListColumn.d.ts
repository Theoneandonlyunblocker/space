import {ListItem} from "./ListItem";
import {ListOrder} from "./ListOrder";

export declare interface ListColumn<T>
{
  key: string;
  label: string;
  title?: string;

  defaultOrder: ListOrder;
  notSortable?: boolean;                                  // if true sort by VVVV
  sortingFunction?: (a: ListItem<T>, b: ListItem<T>) => number; // sortingFunction(a, b)
  propToSortBy?: string;                                  // sort(a.sortingProps[propToSortBy], b.sortingProps[propToSortBy])
                                                          // sort(a.key, b.key)
}
