import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import Item from "../../Item";
import Unit from "../../Unit";
import AbilityBase from "../../templateinterfaces/AbilityBase";

import AbilityList from "./AbilityList";
import UnitExperience from "./UnitExperience";
import UnitItemGroup from "./UnitItemGroup";


export interface PropTypes extends React.Props<any>
{
  onDragEnd?: (dropSuccessful?: boolean) => void;
  onDragStart?: (item: Item) => void;
  onMouseUp?: (index: number) => void;
  currentDragItem?: Item | null;
  unit: Unit | null;
  isDraggable?: boolean;
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

        onMouseUp: this.props.onMouseUp,
        isDraggable: this.props.isDraggable,
        onDragStart: this.props.onDragStart,
        onDragEnd: this.props.onDragEnd,
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

const factory: React.Factory<PropTypes> = React.createFactory(MenuUnitInfoComponent);
export default factory;
