module Rance
{
  export module UIComponents
  {
    export var ManufactoryUpgradeButton = React.createClass(
    {
      displayName: "ManufactoryUpgradeButton",

      propTypes:
      {
        money: React.PropTypes.number.isRequired,
        upgradeCost: React.PropTypes.number.isRequired,
        onClick: React.PropTypes.func.isRequired,
        actionString: React.PropTypes.string.isRequired,
        currentLevel: React.PropTypes.number.isRequired,
        maxLevel: React.PropTypes.number.isRequired,
        levelDecimalPoints: React.PropTypes.number.isRequired,
        title: React.PropTypes.string
      },

      getInitialState: function()
      {
        return(
        {
          canAffordUpgrade: this.props.money >= this.props.upgradeCost,
          isDisabled: this.props.currentLevel >= this.props.maxLevel
        });
      },

      componentWillReceiveProps: function(newProps: any)
      {
        this.setState(
        {
          canAffordUpgrade: newProps.money >= newProps.upgradeCost,
          isDisabled: newProps.currentLevel >= newProps.maxLevel
        })
      },

      render: function()
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
    })
  }
}
