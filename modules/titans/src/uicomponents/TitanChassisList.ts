import * as React from "react";
import { TitanChassisTemplate } from "../TitanChassisTemplate";
import { List } from "modules/defaultui/src/uicomponents/list/List";
import { ListColumn } from "modules/defaultui/src/uicomponents/list/ListColumn";
import { localize as localizeGeneric } from "modules/defaultui/localization/localize";
import { ListItem } from "modules/defaultui/src/uicomponents/list/ListItem";
import {PropTypes as TitanChassisListItemProps, TitanChassisListItem} from "./TitanChassisListItem";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  allChassis: TitanChassisTemplate[];
  selectedChassis: TitanChassisTemplate | undefined;
  onSelect?: (selectedChassis: TitanChassisTemplate) => void;
}

const TitanChassisListComponent: React.FunctionComponent<PropTypes> = props =>
{
  const columns: ListColumn<TitanChassisListItemProps>[] =
  [
    {
      label: localizeGeneric("displayName").toString(),
      key: "name",
      defaultOrder: "asc",
    }
  ];

  const rows: ListItem<TitanChassisListItemProps>[] = props.allChassis.map(chassis =>
  {
    return {
      key: chassis.key,
      content: TitanChassisListItem(
      {
        chassis: chassis,
        isSelected: chassis === props.selectedChassis,
      }),
    };
  });

  return(
    List(
    {
      listItems: rows,
      initialColumns: columns,
      initialSortOrder: [columns[0]],
      noHeader: true,
      addSpacer: true,
      onRowChange: (row) =>
      {
        props.onSelect(row.content.props.chassis);
      },
    })
  );
};

export const TitanChassisList: React.FunctionComponentFactory<PropTypes> = React.createFactory(TitanChassisListComponent);
