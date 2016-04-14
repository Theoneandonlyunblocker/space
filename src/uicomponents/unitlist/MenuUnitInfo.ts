/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react/addons";

/// <reference path="abilitylist.ts" />
/// <reference path="unititemwrapper.ts"/>
/// <reference path="unitexperience.ts" />

import Item from "../../Item";
import Unit from "../../Unit";
import AbilityBase from "../../templateinterfaces/AbilityBase";
import UnitItemWrapper from "./UnitItemWrapper";
import AbilityList from "./AbilityList";
import UnitExperience from "./UnitExperience";


interface PropTypes extends React.Props<any>
{
  onDragEnd?: (dropSuccesful?: boolean) => void;
  onDragStart?: (item: Item) => void;
  onMouseUp?: (itemSlot: string) => void;
  currentDragItem?: Item;
  unit: Unit;
  isDraggable?: boolean;
}

interface StateType
{
}

export class MenuUnitInfoComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "MenuUnitInfo";
  state: StateType;

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
    var unit = this.props.unit;
    if (!unit) return(
      React.DOM.div({className: "menu-unit-info"})
    )

    var itemSlots: React.ReactElement<any>[] = [];

    for (var slot in unit.items)
    {
      itemSlots.push(UnitItemWrapper(
      {
        key: slot,
        slot: slot,
        item: unit.items[slot],
        onMouseUp: this.props.onMouseUp,

        isDraggable: this.props.isDraggable,
        onDragStart: this.props.onDragStart,
        onDragEnd: this.props.onDragEnd,
        currentDragItem: this.props.currentDragItem
      }));
    }

    var unitAbilities: AbilityBase[] = unit.getAllAbilities();
    unitAbilities = unitAbilities.concat(unit.getAllPassiveSkills());

    return(
      React.DOM.div(
      {
        className: "menu-unit-info"
      },
        React.DOM.div(
        {
          className: "menu-unit-info-name"
        }, unit.name),
        React.DOM.div(
        {
          className: "menu-unit-info-abilities"
        },
          AbilityList(
          {
            abilities: unitAbilities
          })
        ),
        UnitExperience(
        {
          experienceForCurrentLevel: unit.experienceForCurrentLevel,
          experienceToNextLevel: unit.getExperienceToNextLevel(),
          unit: unit,
          onUnitUpgrade: this.handleUnitUpgrade
        }),
        React.DOM.div(
        {
          className: "menu-unit-info-items-wrapper"
        },
          itemSlots
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(MenuUnitInfoComponent);
export default Factory;
