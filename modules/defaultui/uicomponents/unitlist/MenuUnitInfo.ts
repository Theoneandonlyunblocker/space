import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Item} from "../../../../src/items/Item";
import {Unit} from "../../../../src/unit/Unit";
import {AbilityBase} from "../../../../src/templateinterfaces/AbilityBase";

import {AbilityList} from "./AbilityList";
import {UnitExperience} from "./UnitExperience";
import {UnitItemGroup} from "./UnitItemGroup";


export interface PropTypes extends React.Props<any>
{
  unit: Unit | null;

  itemsAreDraggable: boolean;
  currentDragItem?: Item | null;
  onItemDragEnd?: (dropSuccessful?: boolean) => void;
  onItemDragStart?: (item: Item) => void;
  onItemSlotMouseUp?: (index: number) => void;
}

interface StateType
{
}

export class MenuUnitInfoComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "MenuUnitInfo";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleUnitUpgrade = this.handleUnitUpgrade.bind(this);
  }

  handleUnitUpgrade()
  {
    this.forceUpdate();
  }
  render()
  {
    const unit = this.props.unit;
    if (!unit) { return(
      ReactDOMElements.div({className: "menu-unit-info"})
    );
    }

    const itemGroups: React.ReactElement<any>[] = [];
    const itemsBySlot = unit.items.getItemsBySlot();

    for (const slot in unit.items.itemSlots)
    {
      itemGroups.push(UnitItemGroup(
      {
        key: slot,

        slotName: slot,
        maxItems: unit.items.itemSlots[slot],
        items: itemsBySlot[slot],

        onMouseUp: this.props.onItemSlotMouseUp,
        isDraggable: this.props.itemsAreDraggable,
        onDragStart: this.props.onItemDragStart,
        onDragEnd: this.props.onItemDragEnd,
        currentDragItem: this.props.currentDragItem,
      }));
    }

    let unitAbilities: AbilityBase[] = unit.getAllAbilities();
    unitAbilities = unitAbilities.concat(unit.getAllPassiveSkills());

    return(
      ReactDOMElements.div(
      {
        className: "menu-unit-info",
      },
        ReactDOMElements.div(
        {
          className: "menu-unit-info-left",
        },
          ReactDOMElements.div(
          {
            className: "menu-unit-info-name",
          }, unit.name),
          ReactDOMElements.div(
          {
            className: "menu-unit-info-abilities",
          },
            AbilityList(
            {
              abilities: unitAbilities,
            }),
          ),
          UnitExperience(
          {
            experienceForCurrentLevel: unit.experienceForCurrentLevel,
            experienceToNextLevel: unit.getExperienceToNextLevel(),
            unit: unit,
            onUnitUpgrade: this.handleUnitUpgrade,
          }),
        ),
        ReactDOMElements.div(
        {
          className: "menu-unit-info-items-wrapper",
        },
          itemGroups,
        ),
      )
    );
  }
}

export const MenuUnitInfo: React.Factory<PropTypes> = React.createFactory(MenuUnitInfoComponent);
