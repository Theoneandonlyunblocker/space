import * as React from "react";
import { TitanAssembly } from "../TitanAssembly";
import { List } from "modules/defaultui/src/uicomponents/list/List";
import { ListColumn } from "modules/defaultui/src/uicomponents/list/ListColumn";
import { localize } from "modules/titans/localization/localize";
import { localize as localizeGeneric } from "modules/defaultui/localization/localize";
import { TitanAssemblyListItem, PropTypes as TitanAssemblyListItemProps } from "./TitanAssemblyListItem";
import { ListItem } from "modules/defaultui/src/uicomponents/list/ListItem";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  assemblies: TitanAssembly[];
  onSelect: (assembly: TitanAssembly) => void;
}

const TitanAssemblyListComponent: React.FunctionComponent<PropTypes> = props =>
{
  const columns: ListColumn<TitanAssemblyListItemProps>[] =
  [
    {
      label: localizeGeneric("displayName").toString(),
      key: "name",
      defaultOrder: "asc"
    },
    {
      label: localize("chassis"),
      key: "chassis",
      defaultOrder: "asc"
    },
    {
      label: localizeGeneric("cost").toString(),
      key: "cost",
      defaultOrder: "desc"
    },
  ];
  const rows: ListItem<TitanAssemblyListItemProps>[] = props.assemblies.map(assembly =>
  {
    const key = assembly.wasAiGenerated ? "_____ai_____." : "" + assembly.key;

    return {
      key: key,
      content: TitanAssemblyListItem(
      {
        name: assembly.displayName,
        chassisName: assembly.chassis.displayName,
        cost: assembly.chassis.buildCost,
      }),
    };
  });

  return(
    List(
    {
      listItems: rows,
      initialColumns: columns,
      initialSortOrder: [columns[1], columns[0], columns[2]]
    })
  );
};

export const TitanAssemblyList: React.FunctionComponentFactory<PropTypes> = React.createFactory(TitanAssemblyListComponent);
