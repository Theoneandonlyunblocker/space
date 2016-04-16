/// <reference path="../../../lib/react-global-0.13.3.d.ts" />

interface PropTypes extends React.Props<any>
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
  displayName: string = "ManufactoryUpgradeButton";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
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
