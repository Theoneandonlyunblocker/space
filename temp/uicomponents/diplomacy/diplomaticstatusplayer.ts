/// <reference path="../playerflag.ts" />
/// <reference path="opinion.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class DiplomaticStatusPlayer extends React.Component<PropTypes, {}>
{
  displayName: string = "DiplomaticStatusPlayer";

  getInitialState()
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
