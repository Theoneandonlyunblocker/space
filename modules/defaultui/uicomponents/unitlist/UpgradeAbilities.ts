import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import {Unit} from "core/unit/Unit";
import {UpgradableAbilitiesData} from "core/abilities/UpgradableAbilitiesData";
import {AbilityBase} from "core/templateinterfaces/AbilityBase";
import {DefaultWindow} from "../windows/DefaultWindow";

import {AbilityList} from "./AbilityList";
import {AbilityListItem} from "./AbilityListItem";


export interface PropTypes extends React.Props<any>
{
  unit: Unit;
  upgradableAbilitiesData: UpgradableAbilitiesData;
  learnableAbilities: AbilityBase[];
  onUpgrade: () => void;
}

interface StateType
{
  activePopupType: "upgrade" | "learn" | null;
  currentlyUpgradingAbility: AbilityBase | null;
}

export class UpgradeAbilitiesComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "UpgradeAbilities";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      activePopupType: null,
      currentlyUpgradingAbility: null,
    };

    this.closePopup = this.closePopup.bind(this);
    this.toggleUpgradeAbilityPopup = this.toggleUpgradeAbilityPopup.bind(this);
    this.toggleLearnNewAbilityPopup = this.toggleLearnNewAbilityPopup.bind(this);
    this.handleUpgradeAbilityTargetClick = this.handleUpgradeAbilityTargetClick.bind(this);
    this.upgradeAbility = this.upgradeAbility.bind(this);
    this.learnAbility = this.learnAbility.bind(this);
  }

  render()
  {
    const canLearnNewAbility = this.props.learnableAbilities.length > 0;

    const currentlyUpgradingAbility = this.state.currentlyUpgradingAbility ?
      this.props.upgradableAbilitiesData[this.state.currentlyUpgradingAbility.type] :
      null;

    return(
      ReactDOMElements.div(
      {
        className: "upgrade-abilities",
      },
        ReactDOMElements.div(
        {
          className: "upgrade-abilities-header",
        },
          localize("upgradeAbilitiesHeader").toString(),
        ),
        AbilityList(
        {
          abilities: Object.keys(this.props.upgradableAbilitiesData).map(sourceAbilityType =>
          {
            return this.props.upgradableAbilitiesData[sourceAbilityType].source;
          }),
          handleClick: this.toggleUpgradeAbilityPopup,
        },
          !canLearnNewAbility ? null : AbilityListItem(
          {
            key: "learnNewAbility",
            type: "learnable",
            displayName: localize("newAbility").toString(),
            title: localize("clickToLearnNewAbility").toString(),

            onClick: this.toggleLearnNewAbilityPopup,
          }),
        ),
        !this.state.activePopupType ? null :
          DefaultWindow(
          {
            title: this.state.activePopupType === "learn" ?
              localize("learnAbility").toString() :
              localize("upgradeSpecificAbility").format(currentlyUpgradingAbility.source.displayName),
            handleClose: this.closePopup,
            isResizable: false,
          },
            AbilityList(
            {
              abilities: this.state.activePopupType === "learn" ?
                this.props.learnableAbilities :
                currentlyUpgradingAbility.possibleUpgrades,
              handleClick: this.state.activePopupType === "learn" ?
                this.learnAbility :
                this.handleUpgradeAbilityTargetClick,
            }),
          ),
      )
    );
  }

  private closePopup(): void
  {
    this.setState(
    {
      activePopupType: null,
      currentlyUpgradingAbility: null,
    });
  }
  private toggleUpgradeAbilityPopup(sourceAbility: AbilityBase): void
  {
    if (this.state.activePopupType === "upgrade")
    {
      this.closePopup();
    }
    else
    {
      this.setState(
      {
        activePopupType: "upgrade",
        currentlyUpgradingAbility: sourceAbility,
      });
    }
  }
  private toggleLearnNewAbilityPopup(): void
  {
    if (this.state.activePopupType === "learn")
    {
      this.closePopup();
    }
    else
    {
      this.setState({activePopupType: "learn"});
    }
  }
  private handleUpgradeAbilityTargetClick(targetAbility: AbilityBase): void
  {
    this.upgradeAbility(this.state.currentlyUpgradingAbility, targetAbility);

    this.setState(
    {
      activePopupType: null,
      currentlyUpgradingAbility: null,
    });
  }
  private upgradeAbility(source: AbilityBase, newAbility: AbilityBase): void
  {
    this.props.unit.upgradeAbility(source, newAbility);
    this.props.unit.handleLevelUp();
    this.closePopup();
    this.props.onUpgrade();
  }
  private learnAbility(newAbility: AbilityBase): void
  {
    this.props.unit.learnAbility(newAbility);
    this.props.unit.handleLevelUp();
    this.closePopup();
    this.props.onUpgrade();
  }
}

export const UpgradeAbilities: React.Factory<PropTypes> = React.createFactory(UpgradeAbilitiesComponent);
