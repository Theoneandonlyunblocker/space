import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import * as localForage from "localforage";

import {localize} from "../../../localization/localize";
import {prettifyDate} from "../../utility";
import List from "../list/List";
import ListColumn from "../list/ListColumn";
import ListItem from "../list/ListItem";

import {default as SaveListItem, PropTypes as SaveListItemProps} from "./SaveListItem";
import { storageStrings } from "../../storageStrings";
import FullSaveData from "../../savedata/FullSaveData";


interface SaveDataForDisplay
{
  key: string;
  name: string;
  date: Date;
}

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

  public componentDidMount()
  {
    const allSaveDataForDisplay: SaveDataForDisplay[] = [];

    localForage.iterate((value: string, key) =>
    {
      if (key.indexOf(storageStrings.savePrefix))
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
  public render()
  {
    const rows: ListItem<SaveListItemProps>[] = [];
    let selected: ListItem<SaveListItemProps> | null = null;

    this.state.saveKeys.forEach(parsedData =>
    {
      const isMarkedForDeletion = this.props.saveKeysToDelete &&
        this.props.saveKeysToDelete.indexOf(parsedData.key) !== -1;

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
          handleDelete: this.props.onDelete ?
            this.props.onDelete.bind(null, parsedData.key) :
            null,
          handleUndoDelete: this.props.onUndoDelete ?
            this.props.onUndoDelete.bind(null, parsedData.key) :
            null,
          onDoubleClick: this.props.onDoubleClick,
        }),
      };

      rows.push(row);
      if (this.props.selectedKey === parsedData.key)
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

    if (this.props.allowDelete)
    {
      columns.push(
      {
        label: localize("del")(),
        key: "delete",
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
          autoSelect: selected ? false : this.props.autoSelect,
          initialSelected: selected,
          keyboardSelect: true,
          addSpacer: true,
        }),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(SaveListComponent);
export default factory;
