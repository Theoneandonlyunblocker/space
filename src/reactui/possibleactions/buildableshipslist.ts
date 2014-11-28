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
      getInitialState: function()
      {
        return(
        {
          shipTemplates: this.props.player.getBuildableShips()
        });
      },

      buildShip: function(rowItem)
      {
        var template = rowItem.data.template;

        var ship = new Rance.Unit(template);
        this.props.player.addUnit(ship);

        var fleet = new Rance.Fleet(this.props.player, [ship], this.props.star);

        this.props.player.money -= template.buildCost;
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