import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import * as localForage from "localforage";

import {localize} from "../../localization/localize";
import {prettifyDate} from "../../../../src/generic/utility";
import {List} from "../list/List";
import {ListColumn} from "../list/ListColumn";
import {ListItem} from "../list/ListItem";

import {SaveListItem, PropTypes as SaveListItemProps} from "./SaveListItem";
import { storageStrings } from "../../../../src/saves/storageStrings";
import {FullSaveData} from "../../../../src/savedata/FullSaveData";


interface SaveDataForDisplay
{
  key: string;
  name: string;
  date: Date;
}

export interface PropTypes extends React.Props<any>
{
  onRowChange: (row: ListItem<SaveListItemProps>) => void;
  saveKeysMarkedForDeletion?: string[];
  selectedKey: string;
  allowDeletion?: boolean;
  onUndoMarkForDeletion?: (saveKey: string, callBack?: () => void) => void;
  onMarkForDeletion?: (saveKey: string) => void;
  onDoubleClick?: () => void;
}

interface StateType
{
  saveKeys: SaveDataForDisplay[];
}

export class SaveListComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "SaveList";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      saveKeys: [],
    };
  }

  public updateAvailableSaves(): void
  {
    const allSaveDataForDisplay: SaveDataForDisplay[] = [];

    localForage.iterate((value: string, key) =>
    {
      if (key.indexOf(storageStrings.savePrefix) !== -1)
      {
        const parsed: FullSaveData = JSON.parse(value);

        allSaveDataForDisplay.push(
        {
          key: key,
          name: parsed.name,
          date: new Date(parsed.date),
        });
      }
    }).then(() =>
    {
      this.setState({saveKeys: allSaveDataForDisplay});
    });
  }
  public componentDidMount()
  {
    this.updateAvailableSaves();
  }
  public render()
  {
    const rows: ListItem<SaveListItemProps>[] = [];
    let selected: ListItem<SaveListItemProps> | null = null;

    this.state.saveKeys.forEach(parsedData =>
    {
      const isMarkedForDeletion = this.props.saveKeysMarkedForDeletion &&
        this.props.saveKeysMarkedForDeletion.indexOf(parsedData.key) !== -1;

      const isSelected = this.props.selectedKey === parsedData.key;

      const row: ListItem<SaveListItemProps> =
      {
        key: parsedData.key,
        content: SaveListItem(
        {
          storageKey: parsedData.key,
          name: parsedData.name,
          date: prettifyDate(parsedData.date),
          accurateDate: parsedData.date.toISOString(),
          isMarkedForDeletion: isMarkedForDeletion,
          isSelected: isSelected,
          onMarkForDeletion: this.props.onMarkForDeletion ?
            this.props.onMarkForDeletion.bind(null, parsedData.key) :
            null,
          onUndoMarkForDeletion: this.props.onUndoMarkForDeletion ?
            this.props.onUndoMarkForDeletion.bind(null, parsedData.key) :
            null,
          onDoubleClick: this.props.onDoubleClick,
        }),
      };

      rows.push(row);
      if (isSelected)
      {
        selected = row;
      }
    });

    const columns: ListColumn<SaveListItemProps>[] =
    [
      {
        label: localize("saveName")(),
        key: "name",
        defaultOrder: "asc",
      },
      {
        label: localize("date")(),
        key: "date",
        defaultOrder: "desc",
        propToSortBy: "accurateDate",
      },
    ];

    if (this.props.allowDeletion)
    {
      columns.push(
      {
        label: localize("del")(),
        key: "delete",
        title: localize("markForDeletion")(),
        defaultOrder: "asc",
        notSortable: true,
      });
    }

    return(
      ReactDOMElements.div({className: "save-list fixed-table-parent"},
        List(
        {
          listItems: rows,
          initialColumns: columns,
          initialSortOrder: [columns[1], columns[0]], // date, name
          onRowChange: this.props.onRowChange,
          autoSelect: Boolean(selected),
          initialSelected: selected,
          keyboardSelect: true,
          addSpacer: true,
        }),
      )
    );
  }
}

export const SaveList: React.Factory<PropTypes> = React.createFactory(SaveListComponent);
