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
          abilityTooltip:
          {
            targetUnit: null,
            parentElement: null
          },
          hoveredAbility: null,
          hoveredUnit: null
        });
      },

      clearAbilityTooltip: function()
      {
        this.setState(
        {
          hoveredUnit: false,
          abilityTooltip:
          {
            targetUnit: null,
            parentElement: null
          },
          hoveredAbility: null,
          potentialDelay: null,
          targetsInPotentialArea: []
        });
      },
      handleMouseLeaveUnit: function(e)
      {
        if (!this.state.hoveredUnit) return;


        var toElement = e.nativeEvent.toElement || e.nativeEvent.relatedTarget;

        if (!toElement)
        {
          this.clearAbilityTooltip();
          return;
        }

        if(
          toElement !== this.state.abilityTooltip.parentElement &&
          (this.refs.abilityTooltip && toElement !== this.refs.abilityTooltip.getDOMNode()) &&
          toElement.parentElement !== this.refs.abilityTooltip.getDOMNode()
        )
        {
          this.clearAbilityTooltip();
        }
      },
      handleMouseEnterUnit: function(unit)
      {
        var facesLeft = unit.battleStats.side === "side2";
        var parentElement = this.getUnitElement(unit);

        this.setState(
        {
          abilityTooltip:
          {
            targetUnit: unit,
            parentElement: parentElement,
            facesLeft: facesLeft
          },
          hoveredUnit: unit
        });
      },

      getUnitElement: function(unit)
      {
        return document.getElementById("unit-id_" + unit.id);
      },

      handleAbilityUse: function(ability, target)
      {
        useAbility(this.props.battle, this.props.battle.activeUnit, ability, target);
        this.clearAbilityTooltip();
        this.props.battle.endTurn();
      },

      handleMouseEnterAbility: function(ability)
      {
        var targetsInPotentialArea = getUnitsInAbilityArea(
          this.props.battle,
          this.props.battle.activeUnit,
          ability,
          this.state.abilityTooltip.targetUnit.battleStats.position
        )

        this.setState(
        {
          hoveredAbility: ability,
          potentialDelay:
          {
            id: this.props.battle.activeUnit.id,
            delay: this.props.battle.activeUnit.battleStats.moveDelay + ability.moveDelay
          },
          targetsInPotentialArea: targetsInPotentialArea
        });
      },
      handleMouseLeaveAbility: function()
      {
        this.setState(
        {
          hoveredAbility: null,
          potentialDelay: null,
          targetsInPotentialArea: []
        });
      },


      render: function()
      {
        var battle = this.props.battle;

        var activeTargets = getTargetsForAllAbilities(battle, battle.activeUnit);

        var abilityTooltip: any = null;

        if (
          this.state.hoveredUnit &&
          activeTargets[this.state.abilityTooltip.targetUnit.id]
        )
        {
          abilityTooltip = UIComponents.AbilityTooltip(
          {
            handleAbilityUse: this.handleAbilityUse,
            handleMouseLeave: this.handleMouseLeaveUnit,
            handleMouseEnterAbility: this.handleMouseEnterAbility,
            handleMouseLeaveAbility: this.handleMouseLeaveAbility,
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
              unitsBySide: battle.unitsBySide,
              potentialDelay: this.state.potentialDelay,
              hoveredUnit: this.state.hoveredUnit,
              onMouseEnterUnit: this.handleMouseEnterUnit,
              onMouseLeaveUnit: this.handleMouseLeaveUnit
            }),
            React.DOM.div({className: "fleets-container"},
              UIComponents.Fleet(
              {
                fleet: battle.side1,
                activeUnit: battle.activeUnit,
                hoveredUnit: this.state.hoveredUnit,
                activeTargets: activeTargets,
                targetsInPotentialArea: this.state.targetsInPotentialArea,
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
                hoveredUnit: this.state.hoveredUnit,
                activeTargets: activeTargets,
                targetsInPotentialArea: this.state.targetsInPotentialArea,
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