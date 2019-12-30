import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Item} from "core/src/items/Item";
import {Unit} from "core/src/unit/Unit";
import {AbilityBase} from "core/src/templateinterfaces/AbilityBase";

import {AbilityList} from "./AbilityList";
import {UnitExperience} from "./UnitExperience";
import {UnitItems} from "./UnitItems";
import { UnitSprite } from "../unit/UnitSprite";
import { UnitPortrait } from "../unit/UnitPortrait";


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

    this.handleUnitUpgrade = this.handleUnitUpgrade.bind(this);
  }

  public render()
  {
    const unit = this.props.unit;
    if (!unit)
    {
      return ReactDOMElements.div({className: "menu-unit-info"}, null);
    }

    let unitAbilities: AbilityBase[] = unit.getAllAbilities();
    unitAbilities = unitAbilities.concat(unit.getAllPassiveSkills());

    return(
      ReactDOMElements.div(
      {
        className: "menu-unit-info",
      },
        UnitSprite(
        {
          unit: this.props.unit,
        }),
        UnitPortrait(
        {
          imageSrc: this.props.unit.portrait.getImageSrc(),
        }),
        ReactDOMElements.div(
        {
          className: "menu-unit-info-name",
        }, unit.name.toString()),
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
        UnitItems(
        {
          itemsBySlot: unit.items.getItemsAndEmptySlots(),

          onMouseUp: this.props.onItemSlotMouseUp,
          isDraggable: this.props.itemsAreDraggable,
          onDragStart: this.props.onItemDragStart,
          onDragEnd: this.props.onItemDragEnd,
          currentDragItem: this.props.currentDragItem,
        }),
      )
    );
  }

  private handleUnitUpgrade()
  {
    this.forceUpdate();
  }
}

export const MenuUnitInfo: React.Factory<PropTypes> = React.createFactory(MenuUnitInfoComponent);
