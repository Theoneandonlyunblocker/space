/// <reference path="fleet.ts"/>
/// <reference path="turncounter.ts"/>
/// <reference path="turnorder.ts"/>
/// <reference path="abilitytooltip.ts"/>

module Rance
{
  export module UIComponents
  {
    export var Battle = React.createClass(
    {
      getInitialState: function()
      {
        return(
        {
          drawAbilityTooltip: false,
          abilityTooltip:
          {
            targetUnit: null,
            parentElement: null
          }
        });
      },

      clearAbilityTooltip: function()
      {
        this.setState(
        {
          drawAbilityTooltip: false,
          abilityTooltip:
          {
            targetUnit: null,
            parentElement: null
          }
        });
      },
      handleMouseLeaveUnit: function(e)
      {
        if (!this.state.drawAbilityTooltip || !this.refs.abilityTooltip) return;

        if(
          e.nativeEvent.toElement !== this.state.abilityTooltip.parentElement &&
          e.nativeEvent.toElement !== this.refs.abilityTooltip.getDOMNode() &&
          e.nativeEvent.toElement.parentElement !== this.refs.abilityTooltip.getDOMNode()
        )
        {
          this.clearAbilityTooltip();
        }
      },
      handleMouseEnterUnit: function(e, unit, facesLeft, parentElement)
      {
        this.setState(
        {
          drawAbilityTooltip: true,
          abilityTooltip:
          {
            targetUnit: unit,
            parentElement: parentElement,
            facesLeft: facesLeft
          }
        });
      },

      handleAbilityUse: function(ability, target)
      {
        useAbility(this.props.battle, this.props.battle.activeUnit, ability, target);
        this.props.battle.endTurn();
      },


      render: function()
      {
        var battle = this.props.battle;

        var activeTargets = getTargetsForAllAbilities(battle, battle.activeUnit);

        var abilityTooltip: any = null;

        if (
          this.state.drawAbilityTooltip &&
          activeTargets[this.state.abilityTooltip.targetUnit.id]
        )
        {
          abilityTooltip = UIComponents.AbilityTooltip(
          {
            handleAbilityUse: this.handleAbilityUse,
            handleMouseLeave: this.handleMouseLeaveUnit,
            targetUnit: this.state.abilityTooltip.targetUnit,
            parentElement: this.state.abilityTooltip.parentElement,
            facesLeft: this.state.abilityTooltip.facesLeft,
            activeTargets: activeTargets,
            ref: "abilityTooltip"
          });
        }

        return(
          React.DOM.div({className: "battle-container"},
            UIComponents.TurnOrder(
            {
              turnOrder: battle.turnOrder,
              unitsBySide: battle.unitsBySide
            }),
            React.DOM.div({className: "fleets-container"},
              UIComponents.Fleet(
              {
                fleet: battle.side1,
                activeUnit: battle.activeUnit,
                activeTargets: activeTargets,
                handleMouseEnterUnit: this.handleMouseEnterUnit,
                handleMouseLeaveUnit: this.handleMouseLeaveUnit
              }),
              UIComponents.TurnCounter(
              {
                turnsLeft: battle.turnsLeft,
                maxTurns: battle.maxTurns
              }),
              UIComponents.Fleet(
              {
                fleet: battle.side2,
                facesLeft: true,
                activeUnit: battle.activeUnit,
                activeTargets: activeTargets,
                handleMouseEnterUnit: this.handleMouseEnterUnit,
                handleMouseLeaveUnit: this.handleMouseLeaveUnit
              }),
              abilityTooltip
            )
          )
        );
      }
    });
  }
}