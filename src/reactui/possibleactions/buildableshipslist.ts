/// <reference path="../../unit.ts" />
/// <reference path="../../fleet.ts" />

/// <reference path="../unitlist/list.ts" />
/// <reference path="buildableship.ts" />

module Rance
{
  export module UIComponents
  {
    export var BuildableShipsList = React.createClass(
    {
      displayName: "BuildableShipsList",
      getInitialState: function()
      {
        return(
        {
          shipTemplates: this.props.star.getBuildableShipTypes()
        });
      },

      buildShip: function(rowItem)
      {
        if (rowItem.data.template.buildCost > this.props.player.money)
        {
          return;
        }
        
        this.props.player.buildUnit(rowItem.data.template, this.props.star);
      },

      render: function()
      {
        if (this.state.shipTemplates.length < 1) return null;
        var rows = [];

        for (var i = 0; i < this.state.shipTemplates.length; i++)
        {
          var template = this.state.shipTemplates[i];

          var data: any =
          {
            template: template,

            typeName: template.typeName,
            buildCost: template.buildCost,
            player: this.props.player,

            rowConstructor: UIComponents.BuildableShip
          };

          rows.push(
          {
            key: i,
            data: data
          });
        }

        var columns: any =
        [
          {
            label: "Name",
            key: "typeName",
            defaultOrder: "asc"
          },
          {
            label: "Cost",
            key: "buildCost",
            defaultOrder: "desc"
          }

        ];

        return(
          React.DOM.div({className: "buildable-item-list buildable-ship-list"},
            UIComponents.List(
            {
              listItems: rows,
              initialColumns: columns,
              onRowChange: this.buildShip
            })
          )
        );
      }
    });
  }
}