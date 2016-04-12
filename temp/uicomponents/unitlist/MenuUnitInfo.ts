/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="abilitylist.ts" />
/// <reference path="unititemwrapper.ts"/>
/// <reference path="unitexperience.ts" />


import Unit from "../../../src/Unit.ts";
import AbilityBase from "../../../src/templateinterfaces/AbilityBase.d.ts";
import UnitItemWrapper from "./UnitItemWrapper.ts";
import AbilityList from "./AbilityList.ts";
import UnitExperience from "./UnitExperience.ts";


interface PropTypes extends React.Props<any>
{
  onDragEnd?: any; // TODO refactor | define prop type 123
  onDragStart?: any; // TODO refactor | define prop type 123
  onMouseUp?: any; // TODO refactor | define prop type 123
  currentDragItem?: any; // TODO refactor | define prop type 123
  unit: Unit;
  isDraggable?: any; // TODO refactor | define prop type 123
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
    var unit: Unit = this.props.unit;
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
