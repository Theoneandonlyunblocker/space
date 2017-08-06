import * as React from "react";

import {AbilityUpgradeData} from "../../AbilityUpgradeData";
import Unit from "../../Unit";

import AbilityBase from "../../templateinterfaces/AbilityBase";

import {default as DefaultWindow} from "../windows/DefaultWindow";

import UpgradeAbilities from "./UpgradeAbilities";
import UpgradeAttributes from "./UpgradeAttributes";

import {localize, localizeF} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  unit: Unit;
  onUnitUpgrade: () => void;
}

interface StateType
{
  currentlyUpgradingAbility: AbilityBase | null;
  upgradeData: AbilityUpgradeData;
}

export class UpgradeUnitComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "UpgradeUnit";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      currentlyUpgradingAbility: null,
      upgradeData: this.props.unit.getAbilityUpgradeData(),
    };

    this.bindMethods();
  }

  public render()
  {
    const unit = this.props.unit;
    const upgradableAbilities: AbilityBase[] = [];

    for (let source in this.state.upgradeData)
    {
      if (this.state.upgradeData[source].base)
      {
        upgradableAbilities.push(this.state.upgradeData[source].base!);
      }
      else
      {
        upgradableAbilities.push(
        {
          type: source,
          displayName: localize("newAbility"),
          description: "",
        });
      }
    }

    const activeUpgradeData = !this.state.currentlyUpgradingAbility ?
      null :
      this.state.upgradeData[this.state.currentlyUpgradingAbility.type];

    return(
      React.DOM.div(
      {
        className: "upgrade-unit",
      },
        !activeUpgradeData ? null:
        DefaultWindow(
        {
          title: localize("upgradeAbility"),
          handleClose: this.closeAbilityUpgradePopup,
          isResizable: false,
        },
          UpgradeAbilities(
          {
            abilities: activeUpgradeData.possibleUpgrades,
            handleClick: this.upgradeAbility.bind(this, activeUpgradeData.base),
            sourceAbility: activeUpgradeData.base,
            learningNewability: !Boolean(activeUpgradeData.base),
          }),
        ),
        React.DOM.div(
        {
          className: "upgrade-unit-header",
        },
          localizeF("unitUpgradeHeader").format(
          {
            unitName: unit.name,
            currentLevel: unit.level,
            nextLevel: unit.level + 1,
          }),
        ),
        UpgradeAbilities(
        {
          abilities: upgradableAbilities,
          handleClick: this.makeAbilityLearnPopup,
        }),
        UpgradeAttributes(
        {
          unit: unit,
          handleClick: this.upgradeAttribute,
        }),
      )
    );
  }

  private bindMethods()
  {
    this.upgradeAttribute = this.upgradeAttribute.bind(this);
    this.upgradeAbility = this.upgradeAbility.bind(this);
    this.makeAbilityLearnPopup = this.makeAbilityLearnPopup.bind(this);
    this.closeAbilityUpgradePopup = this.closeAbilityUpgradePopup.bind(this);
  }
  private upgradeAbility(source: AbilityBase, newAbility: AbilityBase)
  {
    const unit = this.props.unit;
    unit.upgradeAbility(source, newAbility);
    unit.handleLevelUp();
    this.setState(
    {
      upgradeData: unit.getAbilityUpgradeData(),
    });
    this.closeAbilityUpgradePopup();
    this.props.onUnitUpgrade();
  }
  private upgradeAttribute(attribute: string)
  {
    const unit = this.props.unit;

    unit.baseAttributes[attribute] += 1;
    unit.attributesAreDirty = true;

    unit.handleLevelUp();
    this.props.onUnitUpgrade();
  }
  private makeAbilityLearnPopup(ability: AbilityBase)
  {
    this.setState({currentlyUpgradingAbility: ability});
  }
  private closeAbilityUpgradePopup()
  {
    this.setState({currentlyUpgradingAbility: null});
  }

}

const Factory: React.Factory<PropTypes> = React.createFactory(UpgradeUnitComponent);
export default Factory;
