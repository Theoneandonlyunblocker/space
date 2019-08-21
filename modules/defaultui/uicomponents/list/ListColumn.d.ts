import {ListItem} from "./ListItem";
import {ListOrder} from "./ListOrder";


type SortingFunction<T> = (a: ListItem<T>, b: ListItem<T>) => number;

/**
 * sorting priority:
 * custom sorting function column.sortingFunction
 * compare specified props column.propToSortby
 * compare item keys
 */
export declare interface ListColumn<T>
{
  key: string;
  label: string;
  title?: string;

  defaultOrder: ListOrder;
  notSortable?: boolean;
  sortingFunction?: SortingFunction<T>;
  propToSortBy?: string;
}
