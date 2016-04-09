/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../playerflag.ts" />
/// <reference path="opinion.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

interface StateType
{
  // TODO refactor | add state type
}

class DiplomaticStatusPlayer extends React.Component<PropTypes, StateType>
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
          UIComponents.PlayerFlag(
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
          UIComponents.Opinion(
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

const Factory = React.createFactory(DiplomaticStatusPlayer);
export default Factory;
