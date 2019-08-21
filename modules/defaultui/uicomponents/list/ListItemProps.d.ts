import {ListColumn} from "./ListColumn";

export declare interface ListItemProps
{
  handleClick?: () => void;
  // TODO 2019.08.21 | isnt generic typing possible here?
  activeColumns?: ListColumn<any>[];
}
