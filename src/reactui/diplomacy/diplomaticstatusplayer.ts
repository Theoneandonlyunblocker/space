/// <reference path="opinion.ts" />

module Rance
{
  export module UIComponents
  {
    export var DiplomaticStatusPlayer = React.createClass(
    {
      displayName: "DiplomaticStatusPlayer",

      getInitialState: function()
      {
        return(
        {
          hasAttitudeModifierTootlip: false
        });
      },
      

      makeCell: function(type: string)
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
              React.DOM.img(
              {
                className: "diplomacy-status-player-icon",
                src: this.props.player.icon
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
      },
      
      render: function()
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
    })
  }
}
