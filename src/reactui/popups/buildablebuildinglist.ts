/// <reference path="../unitlist/list.ts" />
/// <reference path="buildablebuilding.ts" />

module Rance
{
  export module UIComponents
  {
    export var BuildableBuildingList = React.createClass(
    {
      getInitialState: function()
      {
        return(
        {
          buildingTemplates: this.props.star.getBuildableBuildings()
        });
      },

      updateBuildings: function()
      {
        this.setState(
        {
          buildingTemplates: this.props.star.getBuildableBuildings()
        });
      },

      buildBuilding: function(rowItem)
      {
        var template = rowItem.data.template;

        var building = new Building(
        {
          template: template,
          location: this.props.star
        });

        this.props.star.addBuilding(building);
        building.controller.money -= template.buildCost;
        this.updateBuildings();
      },

      render: function()
      {
        if (this.state.buildingTemplates < 1) return null;
        var rows = [];

        for (var i = 0; i < this.state.buildingTemplates.length; i++)
        {
          var template = this.state.buildingTemplates[i];

          var data: any =
          {
            template: template,

            typeName: template.name,
            buildCost: template.buildCost,

            rowConstructor: UIComponents.BuildableBuilding
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
          React.DOM.div({className: "buildable-building-list"},
            UIComponents.List(
            {
              listItems: rows,
              initialColumns: columns,
              onRowChange: this.buildBuilding
            })
          )
        );
      }
    });
  }
}