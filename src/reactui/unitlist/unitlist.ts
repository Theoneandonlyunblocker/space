/// <reference path="list.ts" />
/// <reference path="unitlistitem.ts" />

module Rance
{
  export module UIComponents
  {
    export var UnitList = React.createClass(
    {
      render: function()
      {
        var rows = [];

        for (var id in this.props.units)
        {
          var unit = this.props.units[id];

          var data: any =
          {
            unit: unit,

            id: unit.id,
            name: unit.name,
            typeName: unit.template.typeName,
            strength: "" + unit.currentStrength + " / " + unit.maxStrength,
            currentStrength: unit.currentStrength,
            maxStrength: unit.maxStrength,
            rowConstructor: UIComponents.UnitListItem,

            isReserved: (this.props.selectedUnits && this.props.selectedUnits[unit.id]),

            onDragStart: this.props.onDragStart,
            onDragEnd: this.props.onDragEnd
          };

          rows.push(
          {
            key: unit.id,
            data: data
          });
        }

        var columns: any =
        [
          {
            label: "Id",
            key: "id",
            defaultOrder: "asc"
          },
          {
            label: "Type",
            key: "typeName",
            defaultOrder: "asc"
          },
          {
            label: "Strength",
            key: "strength",
            defaultOrder: "desc",
            sortingFunction: function(a, b)
            {
              return a.data.currentStrength - b.data.currentStrength;
            }
          }
        ];

        return(
          UIComponents.List(
          {
            listItems: rows,
            initialColumns: columns
          })
        );
      }
    });
  }
}