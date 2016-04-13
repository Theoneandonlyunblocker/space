/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

interface PropTypes extends React.Props<any>
{
  money: number;
  upgradeCost: number;
  onClick: reactTypeTODO_func;
  actionString: string;
  currentLevel: number;
  maxLevel: number;
  levelDecimalPoints: number;
  title?: string;
}

interface StateType
{
  canAffordUpgrade: boolean;
  isDisabled: boolean;
}

export class ManufactoryUpgradeButtonComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "ManufactoryUpgradeButton";


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      canAffordUpgrade: this.props.money >= this.props.upgradeCost,
      isDisabled: this.props.currentLevel >= this.props.maxLevel
    });
  }

  componentWillReceiveProps(newProps: PropTypes)
  {
    this.setState(
    {
      canAffordUpgrade: newProps.money >= newProps.upgradeCost,
      isDisabled: newProps.currentLevel >= newProps.maxLevel
    })
  }

  render()
  {
    var unitUpgradeButtonBaseClassName = "manufactory-upgrade-button";
    var unitUpgradeCostBaseClassName = "manufactory-upgrade-button-cost";

    var isDisabled = this.state.isDisabled || !this.state.canAffordUpgrade;
    if (isDisabled)
    {
      unitUpgradeButtonBaseClassName += " disabled";
    }

    if (!this.state.canAffordUpgrade)
    {
      unitUpgradeCostBaseClassName += " negative";
    }

    return(
      React.DOM.button(
      {
        className: unitUpgradeButtonBaseClassName + " manufactory-units-upgrade-health-button",
        onClick: (isDisabled ? null : this.props.onClick),
        disabled: isDisabled,
        title: this.props.title
      },
        React.DOM.span(
        {
          className: "manufactory-upgrade-button-action"
        },
          this.props.actionString
        ),
        React.DOM.br(),
        React.DOM.span(
        {
          className: "manufactory-upgrade-button-level"
        },
          "" + this.props.currentLevel.toFixed(this.props.levelDecimalPoints) + "/" +
            this.props.maxLevel.toFixed(this.props.levelDecimalPoints)
        ),
        React.DOM.span(
        {
          className: unitUpgradeCostBaseClassName
        },
          this.props.upgradeCost
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ManufactoryUpgradeButtonComponent);
export default Factory;
