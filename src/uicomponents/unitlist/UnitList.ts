import * as React from "react";
import ListColumn from "../list/ListColumn";
import ListItem from "../list/ListItem";

import Unit from "../../Unit";
import List from "../list/List";
import {default as UnitListItem, PropTypes as UnitListItemProps} from "./UnitListItem";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  units: Unit[];
  selectedUnit: Unit;
  onRowChange: (row: ListItem<UnitListItemProps>) => void;
  isDraggable: boolean;
  reservedUnits: Unit[];
  unavailableUnits: Unit[];

  autoSelect?: boolean;
  onMouseLeave?: () => void;
  onDragStart?: (unit: Unit) => void;
  onDragEnd?: (dropSuccesful?: boolean) => void;
  onMouseEnterUnit?: (unit: Unit) => void;
  hoveredUnit?: Unit;
}

interface StateType
{
}

export class UnitListComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "UnitList";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    const rows: ListItem<UnitListItemProps>[] = this.props.units.map(unit =>
    {
      return(
      {
        key: "" + unit.id,
        content: UnitListItem(
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

          isReserved: this.props.reservedUnits.indexOf(unit) !== -1,
          isUnavailable: this.props.unavailableUnits.indexOf(unit) !== -1,
          isSelected: (this.props.selectedUnit && this.props.selectedUnit.id === unit.id),
          isHovered: (this.props.hoveredUnit && this.props.hoveredUnit.id === unit.id),

          onMouseEnter: this.props.onMouseEnterUnit,
          onMouseLeave: this.props.onMouseLeave,

          isDraggable: this.props.isDraggable,
          onDragStart: this.props.onDragStart,
          onDragEnd: this.props.onDragEnd,
          dragPositionerProps:
          {
            shouldMakeClone: true,
          },
        }),
      });
    });

    const columns: ListColumn<UnitListItemProps>[] =
    [
      {
        label: localize("id"),
        key: "id",
        defaultOrder: "asc",
      },
      {
        label: localize("type"),
        key: "typeName",
        defaultOrder: "asc",
      },
      {
        label: localize("strength"),
        key: "strength",
        defaultOrder: "desc",
        sortingFunction: (a, b) =>
        {
          return a.content.props.currentHealth - b.content.props.currentHealth;
        },
      },
      {
        label: localize("act"),
        key: "maxActionPoints",
        defaultOrder: "desc",
      },
      {
        label: localize("atk"),
        key: "attack",
        defaultOrder: "desc",
      },
      {
        label: localize("def"),
        key: "defence",
        defaultOrder: "desc",
      },
      {
        label: localize("int"),
        key: "intelligence",
        defaultOrder: "desc",
      },
      {
        label: localize("spd"),
        key: "speed",
        defaultOrder: "desc",
      },

    ];

    return(
      React.DOM.div({className: "unit-list fixed-table-parent"},
        List(
        {
          listItems: rows,
          initialColumns: columns,
          onRowChange: this.props.onRowChange,
          autoSelect: this.props.autoSelect,
          keyboardSelect: true,
        }),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UnitListComponent);
export default Factory;
