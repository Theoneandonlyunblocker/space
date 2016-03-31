/// <reference path="upgradeabilities.ts" />
/// <reference path="upgradeattributes.ts" />

module Rance
{
  export module UIComponents
  {
    export var UpgradeUnit = React.createFactory(React.createClass(
    {
      displayName: "UpgradeUnit",
      getInitialState: function()
      {
        return(
        {
          upgradeData: this.props.unit.getAbilityUpgradeData(),
          popupId: undefined
        });
      },
      upgradeAbility: function(source: Templates.IAbilityBase, newAbility: Templates.IAbilityBase)
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
      },
      upgradeAttribute: function(attribute: string)
      {
        var unit: Unit = this.props.unit;

        unit.baseAttributes[attribute] += 1;
        unit.attributesAreDirty = true;

        unit.handleLevelUp();
        this.props.onUnitUpgrade();
      },
      makeAbilityLearnPopup: function(ability: Templates.IAbilityBase)
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
      },
      closePopup: function()
      {
        this.refs.popupManager.closePopup(this.state.popupId);
        this.setState(
        {
          popupId: undefined
        });
      },
      render: function()
      {
        var unit: Unit = this.props.unit;
        var upgradableAbilities: Templates.IAbilityBase[] = [];

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
    }));
  }
}
