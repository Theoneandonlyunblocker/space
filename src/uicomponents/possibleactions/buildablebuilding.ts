/// <reference path="../mixins/updatewhenmoneychanges.ts" />

/// <reference path="../../player.ts" />

module Rance
{
  export module UIComponents
  {
    export var BuildableBuilding = React.createFactory(React.createClass(
    {
      displayName: "BuildableBuilding",
      mixins: [UpdateWhenMoneyChanges],

      propTypes:
      {
        template: React.PropTypes.object.isRequired,
        player: React.PropTypes.instanceOf(Player).isRequired,
        buildCost: React.PropTypes.number.isRequired,
        handleClick: React.PropTypes.func.isRequired
      },

      getInitialState: function()
      {
        return(
        {
          canAfford: this.props.player.money >= this.props.buildCost
        });
      },
      
      overrideHandleMoneyChange: function()
      {
        this.setState(
        {
          canAfford: this.props.player.money >= this.props.buildCost
        });
      },

      makeCell: function(type: string)
      {
        var cellProps: any = {};
        cellProps.key = type;
        cellProps.className = "buildable-building-list-item-cell " + type;

        var cellContent: any;

        switch (type)
        {
          case ("buildCost"):
          {
            if (!this.state.canAfford)
            {
              cellProps.className += " negative";
            }
          }
          default:
          {
            cellContent = this.props[type];

            break;
          }
        }

        return(
          React.DOM.td(cellProps, cellContent)
        );
      },

      render: function()
      {
        var template: Templates.IBuildingTemplate = this.props.template;
        var cells: ReactDOMPlaceHolder[] = [];
        var columns = this.props.activeColumns;

        for (var i = 0; i < columns.length; i++)
        {
          cells.push(
            this.makeCell(columns[i].key)
          );
        }

        var props: any =
        {
          className: "buildable-item buildable-building",
          onClick: this.props.handleClick,
          title: template.description
        }
        if (!this.state.canAfford)
        {
          props.onClick = null;
          props.disabled = true;
          props.className += " disabled";
        }

        return(
          React.DOM.tr(props,
          cells
          )
        );
      }
    }));
  }
}