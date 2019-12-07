import * as React from "react";
import { TitanPrototype } from "../TitanPrototype";
import { List } from "modules/defaultui/src/uicomponents/list/List";
import { ListColumn } from "modules/defaultui/src/uicomponents/list/ListColumn";
import { localize } from "modules/titans/localization/localize";
import { localize as localizeGeneric } from "modules/defaultui/localization/localize";
import { TitanPrototypeListItem, PropTypes as TitanPrototypeListItemProps } from "./TitanPrototypeListItem";
import { ListItem } from "modules/defaultui/src/uicomponents/list/ListItem";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  assemblies: TitanPrototype[];
  onSelect: (assembly: TitanPrototype) => void;
}

const TitanPrototypeListComponent: React.FunctionComponent<PropTypes> = props =>
{
  const columns: ListColumn<TitanPrototypeListItemProps>[] =
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
  const rows: ListItem<TitanPrototypeListItemProps>[] = props.assemblies.map(assembly =>
  {
    const key = assembly.wasAiGenerated ? "_____ai_____." : "" + assembly.key;

    return {
      key: key,
      content: TitanPrototypeListItem(
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

export const TitanPrototypeList: React.FunctionComponentFactory<PropTypes> = React.createFactory(TitanPrototypeListComponent);
