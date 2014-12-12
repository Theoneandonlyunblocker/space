/// <reference path="fleet.ts"/>
/// <reference path="turncounter.ts"/>
/// <reference path="turnorder.ts"/>
/// <reference path="abilitytooltip.ts"/>
/// <reference path="battlescore.ts"/>

module Rance
{
  export module UIComponents
  {
    export var Battle = React.createClass(
    {
      displayName: "Battle",
      getInitialState: function()
      {
        return(
        {
          abilityTooltip:
          {
            parentElement: null,
            facesLeft: null
          },
          hoveredAbility: null,
          hoveredUnit: null
        });
      },
      componentWillMount: function()
      {
        var location = this.props.battle.battleData.location;
        this.backgroundImage = this.makeBackgroundImage(location.getBackgroundSeed());
      },
      makeBackgroundImage: function(seed: string)
      {
        console.log(seed)
        return this.props.makeBackgroundFunction(seed).getBase64();
      },

      clearHoveredUnit: function()
      {
        this.setState(
        {
          hoveredUnit: false,
          abilityTooltip:
          {
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
          this.clearHoveredUnit();
          return;
        }

        if (!this.refs.abilityTooltip)
        {
          this.clearHoveredUnit();
          return;
        }


        var tooltipElement = this.refs.abilityTooltip.getDOMNode();

        if(
          toElement !== this.state.abilityTooltip.parentElement &&
          (this.refs.abilityTooltip && toElement !== tooltipElement) &&
          toElement.parentElement !== tooltipElement
        )
        {
          this.clearHoveredUnit();
        }
      },
      handleMouseEnterUnit: function(unit)
      {
        if (this.props.battle.ended) return;

        var facesLeft = unit.battleStats.side === "side2";
        var parentElement = this.getUnitElement(unit);

        this.setState(
        {
          abilityTooltip:
          {
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
        this.clearHoveredUnit();
        this.props.battle.endTurn();
      },

      finishBattle: function()
      {
        var battle = this.props.battle;
        if (!battle.ended) throw new Error();

        battle.finishBattle();
      },

      handleMouseEnterAbility: function(ability)
      {
        var targetsInPotentialArea = getUnitsInAbilityArea(
          this.props.battle,
          this.props.battle.activeUnit,
          ability,
          this.state.hoveredUnit.battleStats.position
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

        if (!battle.ended)
        {
          var activeTargets = getTargetsForAllAbilities(battle, battle.activeUnit);
        }

        var abilityTooltip: any = null;

        if (
          !battle.ended &&
          this.state.hoveredUnit &&
          activeTargets[this.state.hoveredUnit.id]
        )
        {
          abilityTooltip = UIComponents.AbilityTooltip(
          {
            handleAbilityUse: this.handleAbilityUse,
            handleMouseLeave: this.handleMouseLeaveUnit,
            handleMouseEnterAbility: this.handleMouseEnterAbility,
            handleMouseLeaveAbility: this.handleMouseLeaveAbility,
            targetUnit: this.state.hoveredUnit,
            parentElement: this.state.abilityTooltip.parentElement,
            facesLeft: this.state.abilityTooltip.facesLeft,
            activeTargets: activeTargets,
            ref: "abilityTooltip"
          });
        }

        return(
          React.DOM.div({className: "battle-container"},
            React.DOM.div(
            {
              className: "battle-upper"
            },
              UIComponents.BattleScore(
              {
                battle: battle
              }),
              UIComponents.TurnOrder(
              {
                turnOrder: battle.turnOrder,
                unitsBySide: battle.unitsBySide,
                potentialDelay: this.state.potentialDelay,
                hoveredUnit: this.state.hoveredUnit,
                onMouseEnterUnit: this.handleMouseEnterUnit,
                onMouseLeaveUnit: this.handleMouseLeaveUnit
              })
            ),
            React.DOM.div(
            {
              className: "fleets-container",
              style:
              {
                backgroundImage: "url(" + this.backgroundImage + ");"
              }
            },
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
            ),
            battle.ended ? React.DOM.button(
            {
              className: "end-battle-button",
              onClick: this.finishBattle
            }, "end") : null
          )
        );
      }
    });
  }
}