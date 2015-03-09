/// <reference path="list.ts" />
/// <reference path="unitlistitem.ts" />

module Rance
{
  export module UIComponents
  {
    export var UnitList = React.createClass(
    {
      displayName: "UnitList",
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
            strength: "" + unit.currentHealth + " / " + unit.maxHealth,
            currentHealth: unit.currentHealth,
            maxHealth: unit.maxHealth,

            maxActionPoints: unit.attributes.maxActionPoints,
            attack: unit.attributes.attack,
            defence: unit.attributes.defence,
            intelligence: unit.attributes.intelligence,
            speed: unit.attributes.speed,

            rowConstructor: UIComponents.UnitListItem,
            makeClone: true,

            isReserved: (this.props.reservedUnits && this.props.reservedUnits[unit.id]),
            noActionsLeft: (this.props.checkTimesActed && unit.timesActedThisTurn >= 1),
            isSelected: (this.props.selectedUnit && this.props.selectedUnit.id === unit.id),

            isDraggable: this.props.isDraggable,
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
              return a.data.currentHealth - b.data.currentHealth;
            }
          },
          {
            label: "Act",
            key: "maxActionPoints",
            defaultOrder: "desc"
          },
          {
            label: "Atk",
            key: "attack",
            defaultOrder: "desc"
          },
          {
            label: "Def",
            key: "defence",
            defaultOrder: "desc"
          },
          {
            label: "Int",
            key: "intelligence",
            defaultOrder: "desc"
          },
          {
            label: "Spd",
            key: "speed",
            defaultOrder: "desc"
          }

        ];

        return(
          React.DOM.div({className: "unit-list"},
            UIComponents.List(
            {
              listItems: rows,
              initialColumns: columns,
              onRowChange: this.props.onRowChange,
              autoSelect: this.props.autoSelect
            })
          )
        );
      }
    });
  }
}