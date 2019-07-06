import {ListColumn} from "./ListColumn";

export declare interface ListItemProps
{
  handleClick?: () => void;
  activeColumns?: ListColumn<any>[];
}
