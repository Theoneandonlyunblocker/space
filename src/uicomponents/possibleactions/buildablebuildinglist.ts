/// <reference path="../unitlist/list.ts" />
/// <reference path="buildablebuilding.ts" />

module Rance
{
  export module UIComponents
  {
    export var BuildableBuildingList = React.createClass(
    {
      displayName: "BuildableBuildingList",
      getInitialState: function()
      {
        return(
        {
          buildingTemplates: this.props.star.getBuildableBuildings()
        });
      },

      updateBuildings: function()
      {
        var buildingTemplates = this.props.star.getBuildableBuildings();
        this.setState(
        {
          buildingTemplates: buildingTemplates
        });

        eventManager.dispatchEvent("playerControlUpdated");
        if (buildingTemplates.length < 1)
        {
          this.props.clearExpandedAction();
        }
      },

      buildBuilding: function(rowItem: IListItem)
      {
        var template = rowItem.data.template;

        var building = new Building(
        {
          template: template,
          location: this.props.star
        });

        if (!building.controller) building.controller = this.props.humanPlayer;

        this.props.star.addBuilding(building);
        building.controller.money -= template.buildCost;
        //building.totalCost += template.buildCost;
        this.updateBuildings();
      },

      render: function()
      {
        if (this.state.buildingTemplates.length < 1) return null;
        var rows: IListItem[] = [];

        for (var i = 0; i < this.state.buildingTemplates.length; i++)
        {
          var template: Templates.IBuildingTemplate = this.state.buildingTemplates[i];

          var data: any =
          {
            template: template,

            typeName: template.displayName,
            buildCost: template.buildCost,
            player: this.props.player,

            rowConstructor: UIComponents.BuildableBuilding
          };

          rows.push(
          {
            key: i,
            data: data
          });
        }

        var columns: IListColumn[] =
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
          React.DOM.div({className: "buildable-item-list buildable-building-list"},
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