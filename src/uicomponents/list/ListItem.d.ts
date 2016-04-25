/// <reference path="../../../lib/react-global.d.ts" />

declare interface ListItem<T>
{
  key: string;
  content: React.ReactElement<T>;
}

export default ListItem;
