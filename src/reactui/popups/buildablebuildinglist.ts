/// <reference path="../unitlist/list.ts" />
/// <reference path="buildablebuilding.ts" />

module Rance
{
  export module UIComponents
  {
    export var BuildableBuildingList = React.createClass(
    {
      buildBuilding: function(rowItem)
      {
        var template = rowItem.data.template;

        console.log(template)
      },
      render: function()
      {
        if (this.props.buildingTemplates.length < 1) return null;
        var rows = [];

        for (var i = 0; i < this.props.buildingTemplates.length; i++)
        {
          var template = this.props.buildingTemplates[i];

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