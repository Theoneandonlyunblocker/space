import * as React from "react";

declare interface ListItem<T>
{
  key: string;
  content: React.ReactElement<T>;
}

export default ListItem;
