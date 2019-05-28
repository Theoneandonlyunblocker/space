import ListColumn from "./ListColumn";

declare interface ListItemProps
{
  handleClick?: () => void;
  activeColumns?: ListColumn<any>[];
}

export default ListItemProps;
