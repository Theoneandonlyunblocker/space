/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

import Player from "../../../src/Player.ts";
import AttitudeModifier from "../../../src/AttitudeModifier.ts";
import Opinion from "./Opinion.ts";
import PlayerFlag from "../PlayerFlag.ts";
import ListColumn from "../unitlist/ListColumn.d.ts";


interface PropTypes extends React.Props<any>
{
  baseOpinion: number;
  player: Player;
  opinion: number;
  activeColumns: ListColumn[];
  attitudeModifiers: AttitudeModifier[];
  handleClick: () => void;
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
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.makeCell = this.makeCell.bind(this);    
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      hasAttitudeModifierTootlip: false
    });
  }
  makeCell(type: string)
  {
    var className = "diplomatic-status-player-cell" + " diplomatic-status-" + type;

    if (type === "flag")
    {
      if (!this.props.player)
      {
        return(
          React.DOM.td(
          {
            key: type,
            className: className
          },
            null
          )
        );
      }

      return(
        React.DOM.td(
        {
          key: type,
          className: className
        },
          PlayerFlag(
          {
            flag: this.props.player.flag,
            props:
            {
              className: "diplomacy-status-player-icon"
            }
          })
        )
      );
    }
    if (type === "opinion")
    {
      return(
        React.DOM.td(
        {
          key: type,
          className: className
        },
          Opinion(
          {
            attitudeModifiers: this.props.attitudeModifiers,
            opinion: this.props.opinion,
            baseOpinion: this.props.baseOpinion
          })
        )
      );
    }

    if (type === "player")
    {
      className += " player-name";
    }

    return(
      React.DOM.td(
      {
        key: type,
        className: className
      }, this.props[type])
    );
  }
  
  render()
  {
    var columns = this.props.activeColumns;

    var cells: React.HTMLElement[] = [];

    for (var i = 0; i < columns.length; i++)
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
