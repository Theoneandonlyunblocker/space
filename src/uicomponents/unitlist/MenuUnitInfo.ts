/// <reference path="../../../lib/react-global.d.ts" />

import Item from "../../Item";
import Unit from "../../Unit";
import AbilityBase from "../../templateinterfaces/AbilityBase";
import UnitItemGroup from "./UnitItemGroup";
import AbilityList from "./AbilityList";
import UnitExperience from "./UnitExperience";


export interface PropTypes extends React.Props<any>
{
  onDragEnd?: (dropSuccesful?: boolean) => void;
  onDragStart?: (item: Item) => void;
  onMouseUp?: (index: number) => void;
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
    const unit = this.props.unit;
    if (!unit) return(
      React.DOM.div({className: "menu-unit-info"})
    )

    const itemGroups: React.ReactElement<any>[] = [];
    const itemsBySlot = unit.items.getItemsBySlot();

    for (let slot in unit.items.itemSlots)
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
          className: "menu-unit-info-left"
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
          })
        ),
        React.DOM.div(
        {
          className: "menu-unit-info-items-wrapper"
        },
          itemGroups
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(MenuUnitInfoComponent);
export default Factory;
