import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";


export interface PropTypes extends React.Props<any>
{
  money: number;
  upgradeCost: number;
  onClick: () => void;
  actionString: string;
  currentLevel: number;
  maxLevel: number;
  levelDecimalPoints: number;
  title?: string;
}

interface StateType
{
}

export class ManufactoryUpgradeButtonComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "ManufactoryUpgradeButton";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    let unitUpgradeButtonBaseClassName = "manufactory-upgrade-button";
    let unitUpgradeCostBaseClassName = "manufactory-upgrade-button-cost";

    const isAtMaxLevel = this.props.currentLevel >= this.props.maxLevel;
    const canAffordUpgrade = this.props.money >= this.props.upgradeCost;
    const isDisabled = isAtMaxLevel || !canAffordUpgrade;

    if (isDisabled)
    {
      unitUpgradeButtonBaseClassName += " disabled";
    }

    if (!canAffordUpgrade)
    {
      unitUpgradeCostBaseClassName += " negative";
    }

    return(
      ReactDOMElements.button(
      {
        className: unitUpgradeButtonBaseClassName + " manufactory-units-upgrade-health-button",
        onClick: (isDisabled ? null : this.props.onClick),
        disabled: isDisabled,
        title: this.props.title,
      },
        ReactDOMElements.span(
        {
          className: "manufactory-upgrade-button-action",
        },
          this.props.actionString,
        ),
        ReactDOMElements.br(),
        ReactDOMElements.span(
        {
          className: "manufactory-upgrade-button-level",
        },
          `${this.props.currentLevel.toFixed(this.props.levelDecimalPoints)} / ${this.props.maxLevel.toFixed(this.props.levelDecimalPoints)}`,
        ),
        ReactDOMElements.span(
        {
          className: unitUpgradeCostBaseClassName,
        },
          this.props.upgradeCost,
        ),
      )
    );
  }
}

export const ManufactoryUpgradeButton: React.Factory<PropTypes> = React.createFactory(ManufactoryUpgradeButtonComponent);
