import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {AttitudeModifier} from "../../../../src/AttitudeModifier";
import {Flag} from "../../../../src/Flag";
import {Player} from "../../../../src/Player";
import {PlayerFlag} from "../PlayerFlag";
import {ListItemProps} from "../list/ListItemProps";

import {Opinion} from "./Opinion";


export interface PropTypes extends ListItemProps, React.Props<any>
{
  player: Player;
  opinion: number | null;
  status: string;
  name: string;
  flag: Flag;
  statusSortingNumber: number;
  canInteractWith: boolean;

  attitudeModifiers?: AttitudeModifier[];
}

interface StateType
{
}

export class DiplomaticStatusPlayerComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "DiplomaticStatusPlayer";

  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.makeCell = this.makeCell.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    return(
    {
      hasAttitudeModifierTootlip: false,
    });
  }
  makeCell(type: string)
  {
    let className = "diplomatic-status-player-cell" + " diplomatic-status-" + type;
    let cellContent: React.ReactElement<any> = this.props[type];

    if (type === "player")
    {
      className += " player-name";
    }
    if (type === "flag" && this.props.flag)
    {
      cellContent = PlayerFlag(
      {
        flag: this.props.flag,
        props:
        {
          className: "diplomacy-status-player-icon",
        },
      });
    }
    if (type === "opinion")
    {
      cellContent = Opinion(
      {
        attitudeModifiers: this.props.attitudeModifiers,
        opinion: this.props.opinion,
      });
    }

    return(
      ReactDOMElements.td(
      {
        key: type,
        className: className,
      },
        cellContent,
      )
    );
  }

  render()
  {
    const columns = this.props.activeColumns;

    const cells: React.ReactHTMLElement<any>[] = [];

    for (let i = 0; i < columns.length; i++)
    {
      const cell = this.makeCell(columns[i].key);

      cells.push(cell);
    }

    const rowProps =
    {
      className: "diplomatic-status-player",
      onClick: this.props.canInteractWith ?
        this.props.handleClick :
        null,
    };

    if (!this.props.canInteractWith)
    {
      rowProps.className += " disabled";
    }

    return(
      ReactDOMElements.tr(rowProps,
        cells,
      )
    );
  }
}

export const DiplomaticStatusPlayer: React.Factory<PropTypes> = React.createFactory(DiplomaticStatusPlayerComponent);
