/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="abilitylist.ts" />
/// <reference path="unititemwrapper.ts"/>
/// <reference path="unitexperience.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

interface StateType
{
  // TODO refactor | add state type
}

class MenuUnitInfo extends React.Component<PropTypes, StateType>
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

    var itemSlots: ReactComponentPlaceHolder[] = [];

    for (var slot in unit.items)
    {
      itemSlots.push(UIComponents.UnitItemWrapper(
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
          UIComponents.AbilityList(
          {
            abilities: unitAbilities
          })
        ),
        UIComponents.UnitExperience(
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

const Factory = React.createFactory(MenuUnitInfo);
export default Factory;
