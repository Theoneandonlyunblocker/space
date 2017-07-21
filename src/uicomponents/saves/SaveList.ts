import * as React from "react";

import {default as SaveListItem, PropTypes as SaveListItemProps} from "./SaveListItem";

import List from "../list/List";
import ListColumn from "../list/ListColumn";
import ListItem from "../list/ListItem";

import {prettifyDate} from "../../utility";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  onRowChange: (row: ListItem<SaveListItemProps>) => void;
  saveKeysToDelete?: string[];
  selectedKey: string;
  autoSelect: boolean;
  allowDelete?: boolean;
  onUndoDelete?: (saveKey: string, callBack?: () => void) => void;
  onDelete?: (saveKey: string) => void;
  onDoubleClick?: () => void;
}

interface StateType
{
}

export class SaveListComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "SaveList";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    const rows: ListItem<SaveListItemProps>[] = [];
    let selected: ListItem<SaveListItemProps>;

    const allKeys = Object.keys(localStorage);

    const saveKeys = allKeys.filter(function(key)
    {
      return (key.indexOf("Save") > -1);
    });

    for (let i = 0; i < saveKeys.length; i++)
    {
      const saveData = JSON.parse(localStorage.getItem(saveKeys[i]));
      const date = new Date(saveData.date);
      let isMarkedForDeletion = false;
      if (this.props.saveKeysToDelete)
      {
        if (this.props.saveKeysToDelete.indexOf(saveKeys[i]) !== -1)
        {
          isMarkedForDeletion = true;
        }
      }

      const row: ListItem<SaveListItemProps> =
      {
        key: saveKeys[i],
        content: SaveListItem(
        {
          storageKey: saveKeys[i],
          name: saveData.name,
          date: prettifyDate(date),
          accurateDate: saveData.date,
          isMarkedForDeletion: isMarkedForDeletion,
          handleDelete: this.props.onDelete ?
            this.props.onDelete.bind(null, saveKeys[i]) :
            null,
          handleUndoDelete: this.props.onUndoDelete ?
            this.props.onUndoDelete.bind(null, saveKeys[i]) :
            null,
          onDoubleClick: this.props.onDoubleClick,
        }),
      };

      rows.push(row);
      if (this.props.selectedKey === saveKeys[i])
      {
        selected = row;
      }
    }

    const columns: ListColumn<SaveListItemProps>[] =
    [
      {
        label: localize("saveName"),
        key: "name",
        defaultOrder: "asc",
      },
      {
        label: localize("date"),
        key: "date",
        defaultOrder: "desc",
        propToSortBy: "accurateDate",
      },
    ];

    if (this.props.allowDelete)
    {
      columns.push(
      {
        label: localize("del"),
        key: "delete",
        defaultOrder: "asc",
        notSortable: true,
      });
    }

    return(
      React.DOM.div({className: "save-list fixed-table-parent"},
        List(
        {
          listItems: rows,
          initialColumns: columns,
          initialSortOrder: [columns[1], columns[0]], //date, name
          onRowChange: this.props.onRowChange,
          autoSelect: selected ? false : this.props.autoSelect,
          initialSelected: selected,
          keyboardSelect: true,
          addSpacer: true,
        }),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SaveListComponent);
export default Factory;
