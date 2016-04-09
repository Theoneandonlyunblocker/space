/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="list.ts" />
/// <reference path="unitlistitem.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

interface StateType
{
  // TODO refactor | add state type
}

class UnitList extends React.Component<PropTypes, StateType>
{
  displayName: string = "UnitList";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  render()
  {
    var rows: IListItem[] = [];

    for (var id in this.props.units)
    {
      var unit = this.props.units[id];

      var data: any =
      {
        unit: unit,

        id: unit.id,
        name: unit.name,
        typeName: unit.template.displayName,
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
        noActionsLeft: (this.props.checkTimesActed && !unit.canActThisTurn()),
        isSelected: (this.props.selectedUnit && this.props.selectedUnit.id === unit.id),
        isHovered: (this.props.hoveredUnit && this.props.hoveredUnit.id === unit.id),

        onMouseEnter: this.props.onMouseEnter,
        onMouseLeave: this.props.onMouseLeave,

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

    var columns: IListColumn[] =
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
        sortingFunction: function(a: {data: Unit;}, b: {data: Unit;})
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
      React.DOM.div({className: "unit-list fixed-table-parent"},
        UIComponents.List(
        {
          listItems: rows,
          initialColumns: columns,
          onRowChange: this.props.onRowChange,
          autoSelect: this.props.autoSelect,
          keyboardSelect: true
        })
      )
    );
  }
}

const Factory = React.createFactory(UnitList);
export default Factory;
