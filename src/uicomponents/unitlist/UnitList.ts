/// <reference path="../../../lib/react-global.d.ts" />
import ListColumn from "../list/ListColumn";
import ListItem from "../list/ListItem";

import Unit from "../../Unit";
import List from "../list/List";
import {default as UnitListItem, PropTypes as UnitListItemProps} from "./UnitListItem";


export interface PropTypes extends React.Props<any>
{
  units: Unit[];
  selectedUnit: Unit;
  onRowChange: (row: ListItem<UnitListItemProps>) => void;
  isDraggable: boolean;

  autoSelect?: boolean;
  onMouseLeave?: () => void;
  onDragStart?: (unit: Unit) => void;
  reservedUnits?: {[unitId: number]: number[]};
  onDragEnd?: (dropSuccesful?: boolean) => void;
  checkTimesActed?: boolean;
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
    var rows: ListItem<UnitListItemProps>[] = this.props.units.map(unit =>
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



          isReserved: Boolean(this.props.reservedUnits && this.props.reservedUnits[unit.id]),
          hasNoActionsLeft: (this.props.checkTimesActed && !unit.canActThisTurn()),
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

    var columns: ListColumn<UnitListItemProps>[] =
    [
      {
        label: "Id",
        key: "id",
        defaultOrder: "asc",
      },
      {
        label: "Type",
        key: "typeName",
        defaultOrder: "asc",
      },
      {
        label: "Strength",
        key: "strength",
        defaultOrder: "desc",
        sortingFunction: (a, b) =>
        {
          return a.content.props.currentHealth - b.content.props.currentHealth;
        },
      },
      {
        label: "Act",
        key: "maxActionPoints",
        defaultOrder: "desc",
      },
      {
        label: "Atk",
        key: "attack",
        defaultOrder: "desc",
      },
      {
        label: "Def",
        key: "defence",
        defaultOrder: "desc",
      },
      {
        label: "Int",
        key: "intelligence",
        defaultOrder: "desc",
      },
      {
        label: "Spd",
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
