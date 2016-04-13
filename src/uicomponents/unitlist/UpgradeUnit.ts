/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="upgradeabilities.ts" />
/// <reference path="upgradeattributes.ts" />


import Unit from "../../Unit";
import AbilityBase from "../../templateinterfaces/AbilityBase";
import UpgradeAttributes from "./UpgradeAttributes";
import UpgradeAbilities from "./UpgradeAbilities";
import TopMenuPopup from "../popups/TopMenuPopup";
import {default as PopupManager, PopupManagerComponent} from "../popups/PopupManager";


interface PropTypes extends React.Props<any>
{
  unit: Unit;
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

export class UpgradeUnitComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "UpgradeUnit";
  state: StateType;
  refsTODO: RefTypes;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.upgradeAttribute = this.upgradeAttribute.bind(this);
    this.upgradeAbility = this.upgradeAbility.bind(this);
    this.makeAbilityLearnPopup = this.makeAbilityLearnPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);    
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
    var unit = this.props.unit;
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
    var unit = this.props.unit;

    unit.baseAttributes[attribute] += 1;
    unit.attributesAreDirty = true;

    unit.handleLevelUp();
    this.props.onUnitUpgrade();
  }
  makeAbilityLearnPopup(ability: AbilityBase)
  {
    var upgradeData = this.state.upgradeData[ability.type];
    var popupId = this.ref_TODO_popupManager.makePopup(
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
    this.ref_TODO_popupManager.closePopup(this.state.popupId);
    this.setState(
    {
      popupId: undefined
    });
  }
  render()
  {
    var unit = this.props.unit;
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
          ref: (component: TODO_TYPE) =>
{
  this.ref_TODO_popupManager = component;
},
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

const Factory: React.Factory<PropTypes> = React.createFactory(UpgradeUnitComponent);
export default Factory;
