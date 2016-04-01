/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="upgradeabilities.ts" />
/// <reference path="upgradeattributes.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class UpgradeUnit extends React.Component<PropTypes, {}>
{
  displayName: string = "UpgradeUnit";
  state:
  {
    
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  getInitialState()
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
      contentConstructor: UIComponents.TopMenuPopup,
      contentProps:
      {
        handleClose: this.closePopup,
        contentConstructor: UIComponents.UpgradeAbilities,
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
        UIComponents.PopupManager(
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
        UIComponents.UpgradeAbilities(
        {
          abilities: upgradableAbilities,
          handleClick: this.makeAbilityLearnPopup
        }),
        UIComponents.UpgradeAttributes(
        {
          unit: unit,
          handleClick: this.upgradeAttribute
        })
      )
    );
  }
}
