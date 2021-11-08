import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {AttitudeModifier} from "core/src/diplomacy/AttitudeModifier";
import {Flag} from "core/src/flag/Flag";
import {Player} from "core/src/player/Player";
import {PlayerFlag} from "../PlayerFlag";
import {ListItemProps} from "../list/ListItemProps";

import {Opinion} from "./Opinion";
import { localize } from "../../../localization/localize";
import { DiplomacyState } from "core/src/diplomacy/DiplomacyState";


export interface PropTypes extends ListItemProps, React.Props<any>
{
  player: Player;
  opinion: number | null;
  status: DiplomacyState | "dead";
  name: string;
  flag: Flag;
  canInteractWith: boolean;

  attitudeModifiers?: AttitudeModifier[];
}

interface StateType
{
}

export class DiplomaticStatusPlayerComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "DiplomaticStatusPlayer";

  public override state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }

  public override render()
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
  private makeCell(type: string): React.ReactHTMLElement<HTMLTableDataCellElement>
  {
    const cellProps: React.HTMLProps<HTMLTableDataCellElement> = (() =>
    {
      const props: React.HTMLProps<HTMLTableDataCellElement> = {};
      props.key = type;
      props.className = `diplomatic-status-player-cell diplomatic-status-${type}`;

      switch (type)
      {
        case "name":
        {
          props.className += " player-name";
          props.title = this.props.name;

          break;
        }
        case "status":
        {
          props.title = localize("diplomacyStateDescription").format({diplomacyState: this.props.status});

          break;
        }
      }

      return props;
    })();
    const cellContent: string | React.ReactElement<any> = (() =>
    {
      switch (type)
      {
        case "flag":
        {
          if (this.props.flag)
          {
            return PlayerFlag(
            {
              flag: this.props.flag,
              props:
              {
                className: "diplomacy-status-player-icon",
              },
            });
          }
          else
          {
            return "";
          }
        }
        case "name":
        {
          return this.props.name;
        }
        case "status":
        {
          if (this.props.status === "dead")
          {
            return localize("deadPlayer").toString();
          }
          else
          {
            return localize("diplomacyState").format({diplomacyState: this.props.status});
          }
        }
        case "opinion":
        {
          return Opinion(
          {
            attitudeModifiers: this.props.attitudeModifiers,
            opinion: this.props.opinion,
          });
        }
        default:
        {
          // TODO 2019.08.21 | remove after this.props.activeColumns has typing
          throw new Error(`Invalid column key ${type}`);
        }
      }
    })();

    return(
      ReactDOMElements.td(cellProps,
        cellContent,
      )
    );
  }
}

export const DiplomaticStatusPlayer: React.Factory<PropTypes> = React.createFactory(DiplomaticStatusPlayerComponent);
