/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="upgradeabilities.ts" />
/// <reference path="upgradeattributes.ts" />


import Unit from "../unit/Unit.ts";
import AbilityBase from "../../../src/templateinterfaces/AbilityBase.d.ts";
import UpgradeAttributes from "./UpgradeAttributes.ts";
import UpgradeAbilities from "./UpgradeAbilities.ts";
import TopMenuPopup from "../popups/TopMenuPopup.ts";
import PopupManager from "../popups/PopupManager.ts";


export interface PropTypes extends React.Props<any>
{
  unit: any; // TODO refactor | define prop type 123
  onUnitUpgrade: any; // TODO refactor | define prop type 123
}

interface StateType
{
  popupId?: any; // TODO refactor | define state type 456
  upgradeData?: any; // TODO refactor | define state type 456
}

interface RefTypes extends React.Refs
{
  popupManager: React.Component<any, any>; // TODO refactor | correct ref type 542 | PopupManager
}

class UpgradeUnit_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "UpgradeUnit";
  state: StateType;
  refs: RefTypes;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      upgradeData: this.props.unit.getAbilityUpgradeData(),
      popupId: undefined
    });
  }
  upgradeAbility(source: AbilityBase, newAbility: AbilityBase)
  {
    var unit: Unit = this.props.unit;
    unit.upgradeAbility(source, newAbility);
    unit.handleLevelUp();
    this.setState(
    {
      upgradeData: unit.getAbilityUpgradeData()
    });
    this.closePopup();
    this.props.onUnitUpgrade();
  }
  upgradeAttribute(attribute: string)
  {
    var unit: Unit = this.props.unit;

    unit.baseAttributes[attribute] += 1;
    unit.attributesAreDirty = true;

    unit.handleLevelUp();
    this.props.onUnitUpgrade();
  }
  makeAbilityLearnPopup(ability: AbilityBase)
  {
    var upgradeData = this.state.upgradeData[ability.type];
    var popupId = this.refs.popupManager.makePopup(
    {
      contentConstructor: TopMenuPopup,
      contentProps:
      {
        handleClose: this.closePopup,
        contentConstructor: UpgradeAbilities,
        contentProps:
        {
          abilities: upgradeData.possibleUpgrades,
          handleClick: this.upgradeAbility.bind(this, upgradeData.base),
          sourceAbility: upgradeData.base,
          learningNewability: !Boolean(upgradeData.base)
        }
      },
      popupProps:
      {
        preventAutoResize: true,
        containerDragOnly: true
      }
    });

    this.setState(
    {
      popupId: popupId
    });
  }
  closePopup()
  {
    this.refs.popupManager.closePopup(this.state.popupId);
    this.setState(
    {
      popupId: undefined
    });
  }
  render()
  {
    var unit: Unit = this.props.unit;
    var upgradableAbilities: AbilityBase[] = [];

    for (var source in this.state.upgradeData)
    {
      if (this.state.upgradeData[source].base)
      {
        upgradableAbilities.push(this.state.upgradeData[source].base);
      }
      else
      {
        upgradableAbilities.push(
        {
          type: source,
          displayName: "** New ability **",
          description: ""
        });
      }
    }

    return(
      React.DOM.div(
      {
        className: "upgrade-unit"
      },
        PopupManager(
        {
          ref: "popupManager",
          onlyAllowOne: true
        }),
        React.DOM.div(
        {
          className: "upgrade-unit-header"
        },
          unit.name + "  " + "Level " + unit.level + " -> " + (unit.level + 1)
        ),
        UpgradeAbilities(
        {
          abilities: upgradableAbilities,
          handleClick: this.makeAbilityLearnPopup
        }),
        UpgradeAttributes(
        {
          unit: unit,
          handleClick: this.upgradeAttribute
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UpgradeUnit_COMPONENT_TODO);
export default Factory;
