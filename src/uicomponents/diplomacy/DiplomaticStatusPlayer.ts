/// <reference path="../../../lib/react-global.d.ts" />

import Player from "../../Player";
import AttitudeModifier from "../../AttitudeModifier";
import Opinion from "./Opinion";
import PlayerFlag from "../PlayerFlag";
import {Flag} from "../../Flag";
import ListItemProps from "../list/ListItemProps";

export interface PropTypes extends ListItemProps, React.Props<any>
{
  player: Player;
  opinion: number;
  status: string;
  name: string;
  flag?: Flag;
  
  baseOpinion?: number;
  attitudeModifiers?: AttitudeModifier[];
  
  statusSortingNumber?: number;
}

interface StateType
{
}

export class DiplomaticStatusPlayerComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "DiplomaticStatusPlayer";

  state: StateType;

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
      hasAttitudeModifierTootlip: false
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
          className: "diplomacy-status-player-icon"
        }
      });
    }
    if (type === "opinion")
    {
      cellContent = Opinion(
      {
        attitudeModifiers: this.props.attitudeModifiers,
        opinion: this.props.opinion,
        baseOpinion: this.props.baseOpinion
      });
    }

    return(
      React.DOM.td(
      {
        key: type,
        className: className
      },
        cellContent
      )
    );
  }
  
  render()
  {
    var columns = this.props.activeColumns;

    var cells: React.ReactHTMLElement<any>[] = [];

    for (let i = 0; i < columns.length; i++)
    {
      var cell = this.makeCell(columns[i].key);

      cells.push(cell);
    }

    var rowProps =
    {
      className: "diplomatic-status-player",
      onClick : this.props.handleClick
    };

    return(
      React.DOM.tr(rowProps,
        cells
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(DiplomaticStatusPlayerComponent);
export default Factory;
