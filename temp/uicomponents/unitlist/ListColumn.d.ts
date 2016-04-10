declare interface ListColumn
{
  label: string;
  title?: string;
  key: string;
  defaultOrder?: string; // optional only if notSortable = true
  order?: string; // dont set this manually

  notSortable?: boolean;
  propToSortBy?: string;
  sortingFunction?: <T>(a: T, b: T) => number;
}

export default ListColumn;
