/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../playerflag.ts" />
/// <reference path="opinion.ts" />


import Opinion from "./Opinion.ts";
import PlayerFlag from "../PlayerFlag.ts";


export interface PropTypes extends React.Props<any>
{
  baseOpinion: any; // TODO refactor | define prop type 123
  player: any; // TODO refactor | define prop type 123
  opinion: any; // TODO refactor | define prop type 123
  activeColumns: any; // TODO refactor | define prop type 123
  attitudeModifiers: any; // TODO refactor | define prop type 123
  handleClick: any; // TODO refactor | define prop type 123
}

interface StateType
{
}

class DiplomaticStatusPlayer_COMPONENT_TODO extends React.Component<PropTypes, StateType>
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

    var cells: any = [];

    for (var i = 0; i < columns.length; i++)
    {
      var cell = this.makeCell(columns[i].key);

      cells.push(cell);
    }

    var rowProps: any =
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

const Factory: React.Factory<PropTypes> = React.createFactory(DiplomaticStatusPlayer_COMPONENT_TODO);
export default Factory;
