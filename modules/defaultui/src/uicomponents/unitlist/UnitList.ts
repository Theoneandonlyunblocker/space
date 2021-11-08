import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import {Unit} from "core/src/unit/Unit";
import {List} from "../list/List";
import {ListColumn} from "../list/ListColumn";
import {ListItem} from "../list/ListItem";

import {UnitListItem, PropTypes as UnitListItemProps} from "./UnitListItem";


export interface PropTypes extends React.Props<any>
{
  units: Unit[];
  selectedUnit: Unit | null;
  onRowChange: (row: ListItem<UnitListItemProps>) => void;
  isDraggable: boolean;
  reservedUnits: Unit[];
  unavailableUnits: Unit[];

  autoSelect?: boolean;
  onDragStart?: (unit: Unit) => void;
  onDragEnd?: (dropSuccessful?: boolean) => void;
  onMouseEnterUnit?: (unit: Unit) => void;
  onMouseLeaveUnit?: () => void;
  onMouseUp?: (unit: Unit) => void;
  hoveredUnit?: Unit | null;
}

interface StateType
{
}

export class UnitListComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "UnitList";
  public override state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public override render()
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
          unitName: unit.name.toString(),
          unitTypeName: unit.template.displayName,
          strength: `${unit.currentHealth} / ${unit.maxHealth}`,
          currentHealth: unit.currentHealth,
          maxHealth: unit.maxHealth,

          maxActionPoints: unit.attributes.maxActionPoints,
          attack: unit.attributes.attack,
          defence: unit.attributes.defence,
          intelligence: unit.attributes.intelligence,
          speed: unit.attributes.speed,

          isReserved: this.props.reservedUnits.indexOf(unit) !== -1,
          isUnavailable: this.props.unavailableUnits.indexOf(unit) !== -1,
          isSelected: Boolean(this.props.selectedUnit && this.props.selectedUnit.id === unit.id),
          isHovered: Boolean(this.props.hoveredUnit && this.props.hoveredUnit.id === unit.id),

          onMouseEnter: this.props.onMouseEnterUnit,
          onMouseLeave: this.props.onMouseLeaveUnit,
          onMouseUp: this.props.onMouseUp,

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
        label: localize("unitName").toString(),
        key: "unitName",
        defaultOrder: "asc",
      },
      {
        label: localize("unitType").toString(),
        key: "unitTypeName",
        defaultOrder: "asc",
      },
      {
        label: localize("unitStrength").toString(),
        title: localize("unitStrength_description").toString(),
        key: "strength",
        defaultOrder: "desc",
        sortingFunction: (a, b) =>
        {
          return a.content.props.currentHealth - b.content.props.currentHealth;
        },
      },
      {
        label: localize("maxActionPoints_short").toString(),
        title: `${localize("maxActionPoints")}\n\n${localize("maxActionPoints_description")}`,
        key: "maxActionPoints",
        defaultOrder: "desc",
      },
      {
        label: localize("attack_short").toString(),
        title: `${localize("attack")}\n\n${localize("attack_description")}`,
        key: "attack",
        defaultOrder: "desc",
      },
      {
        label: localize("defence_short").toString(),
        title: `${localize("defence")}\n\n${localize("defence_description")}`,
        key: "defence",
        defaultOrder: "desc",
      },
      {
        label: localize("intelligence_short").toString(),
        title: `${localize("intelligence")}\n\n${localize("intelligence_description")}`,
        key: "intelligence",
        defaultOrder: "desc",
      },
      {
        label: localize("speed_short").toString(),
        title: `${localize("speed")}\n\n${localize("speed_description")}`,
        key: "speed",
        defaultOrder: "desc",
      },
    ];

    return(
      ReactDOMElements.div({className: "unit-list"},
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

export const UnitList: React.Factory<PropTypes> = React.createFactory(UnitListComponent);
