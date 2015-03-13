/// <reference path="fleet.ts"/>
/// <reference path="turncounter.ts"/>
/// <reference path="turnorder.ts"/>
/// <reference path="abilitytooltip.ts"/>
/// <reference path="battlescore.ts"/>
/// <reference path="battlescene.ts"/>
/// <reference path="battledisplaystrength.ts"/>

module Rance
{
  export module UIComponents
  {
    export var Battle = React.createClass(
    {
      displayName: "Battle",

      // set as a property of the class instead of its state
      // as its not used for trigger updates
      // and needs to be changed synchronously
      tempHoveredUnit: null,

      getInitialState: function()
      {
        return(
        {
          abilityTooltip:
          {
            parentElement: null,
            facesLeft: null
          },
          targetsInPotentialArea: [],
          potentialDelay: null,

          hoveredAbility: null,
          hoveredUnit: null,

          battleSceneUnit1StartingStrength: null,
          battleSceneUnit2StartingStrength: null,
          battleSceneUnit1: null,
          battleSceneUnit2: null,
          playingBattleEffect: false,
          playingBattleEffectActive: false
        });
      },
      resize: function()
      {
        var seed = this.props.battle.battleData.location.getBackgroundSeed();

        var blurArea = this.refs.fleetsContainer.getDOMNode().getBoundingClientRect();

        this.props.renderer.blurProps =
        [
          blurArea.left,
          0,
          blurArea.width,
          blurArea.height,
          seed
        ];
      },

      componentDidMount: function()
      {
        this.props.renderer.isBattleBackground = true;

        this.resize();

        this.props.renderer.bindRendererView(this.refs.pixiContainer.getDOMNode());

        window.addEventListener("resize", this.resize, false);

        this.setBattleSceneUnits(this.state.hoveredUnit);

        if (this.props.battle.getActivePlayer() !== this.props.humanPlayer)
        {
          this.useAIAbility();
        }
      },
      componentWillUnmount: function()
      {
        window.removeEventListener("resize", this.resize);
        this.props.renderer.removeRendererView();
      },

      clearHoveredUnit: function()
      {
        this.tempHoveredUnit = null;
        this.setState(
        {
          hoveredUnit: null,
          abilityTooltip:
          {
            parentElement: null
          },
          hoveredAbility: null,
          potentialDelay: null,
          targetsInPotentialArea: []
        });

        this.setBattleSceneUnits(null);
      },
      handleMouseLeaveUnit: function(e)
      {
        console.log(Date.now(), "leave unit");
        this.tempHoveredUnit = null;

        if (!this.state.hoveredUnit || this.state.playingBattleEffect) return;

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
        this.tempHoveredUnit = unit;

        console.log(Date.now(), "enter unit", unit.name, this.tempHoveredUnit);
        if (this.props.battle.ended || this.state.playingBattleEffect) return;

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

        this.setBattleSceneUnits(unit);
      },

      getUnitElement: function(unit)
      {
        return document.getElementById("unit-id_" + unit.id);
      },

      setBattleSceneUnits: function(hoveredUnit: Unit)
      {
        if (this.state.playingBattleEffect) return;

        var activeUnit = this.props.battle.activeUnit;
        if (!activeUnit)
        {
          this.setState(
          {
            battleSceneUnit1: null,
            battleSceneUnit2: null
          });
          return;
        }

        var shouldDisplayHovered = (hoveredUnit &&
          hoveredUnit.battleStats.side !== activeUnit.battleStats.side);

        var unit1, unit2;

        if (activeUnit.battleStats.side === "side1")
        {
          unit1 = activeUnit;
          unit2 = shouldDisplayHovered ? hoveredUnit : null;
        }
        else
        {
          unit1 = shouldDisplayHovered ? hoveredUnit : null;
          unit2 = activeUnit;
        }

        this.setState(
        {
          battleSceneUnit1: unit1,
          battleSceneUnit2: unit2
        });

      },

      handleAbilityUse: function(ability, target)
      {
        var abilityData = getAbilityUseData(this.props.battle,
          this.props.battle.activeUnit, ability, target);

        for (var i = 0; i < abilityData.beforeUse.length; i++)
        {
          abilityData.beforeUse[i]();
        }

        this.playBattleEffect(abilityData, 0);
      },
      playBattleEffect: function(abilityData: IAbilityUseData, i: number)
      {
        var effectData = abilityData.effectsToCall;
        if (!effectData[i])
        {
          for (var i = 0; i < abilityData.afterUse.length; i++)
          {
            abilityData.afterUse[i]();
          }

          this.clearBattleEffect(abilityData);

          this.handleTurnEnd();

          return;
        };

        var side1Unit = null;
        var side2Unit = null;
        [effectData[i].user, effectData[i].target].forEach(function(unit)
        {
          if (unit.battleStats.side === "side1" && !side1Unit)
          {
            side1Unit = unit;
          }
          else if (unit.battleStats.side === "side2" && !side2Unit)
          {
            side2Unit = unit;
          }
        });

        var previousUnit1Strength = side1Unit ? side1Unit.currentHealth : null;
        var previousUnit2Strength = side2Unit ? side2Unit.currentHealth : null;

        if (!this.tempHoveredUnit)
        {
          this.tempHoveredUnit = this.state.hoveredUnit;
          console.log(Date.now(), "set temp in battle effect", this.tempHoveredUnit)
        }

        this.setState(
        {
          battleSceneUnit1StartingStrength: previousUnit1Strength,
          battleSceneUnit2StartingStrength: previousUnit2Strength,
          battleSceneUnit1: side1Unit,
          battleSceneUnit2: side2Unit,
          playingBattleEffect: true,
          hoveredUnit: abilityData.originalTarget,
          abilityTooltip:
          {
            parentElement: null
          },
          hoveredAbility: null,
          potentialDelay: null,
          targetsInPotentialArea: []
        });

        var baseBeforeDelay = Options.battleAnimationTiming["before"];
        var beforeDelay = baseBeforeDelay / (1 + Math.log(i + 1));

        var effectDuration = Options.battleAnimationTiming["effectDuration"];
        var afterDelay = Options.battleAnimationTiming["after"];

        var finishEffectFN = this.playBattleEffect.bind(this, abilityData, i + 1);
        console.log(Date.now(), "bind finish effect", this.tempHoveredUnit ? this.tempHoveredUnit.id : null);

        var startEffectFN = function()
        {
          effectData[i].effect();

          this.setState(
          {
            playingBattleEffectActive: true
          });

          window.setTimeout(finishEffectFN, effectDuration + afterDelay);
        }.bind(this);

        window.setTimeout(startEffectFN, beforeDelay);
      },
      clearBattleEffect: function()
      {
        this.setState(
        {
          playingBattleEffect: false,
          hoveredUnit: null
        });

        if (this.tempHoveredUnit)
        {
          console.log(Date.now(), "set hovered from temp", this.tempHoveredUnit.id);
          this.handleMouseEnterUnit(this.tempHoveredUnit);
          this.tempHoveredUnit = null;
        }
      },

      handleTurnEnd: function()
      {
        if (this.state.hoveredUnit && this.state.hoveredUnit.isTargetable())
        {
          this.forceUpdate();
        }
        else
        {
          this.clearHoveredUnit();
        }

        this.props.battle.endTurn();
        this.setBattleSceneUnits(this.state.hoveredUnit);

        if (this.props.battle.getActivePlayer() !== this.props.humanPlayer)
        {
          this.useAIAbility();
        }
      },
      useAIAbility: function()
      {
        if (!this.props.battle.activeUnit || this.props.battle.ended) return;
        
        var tree = new MCTree(this.props.battle,
          this.props.battle.activeUnit.battleStats.side);

        var move = tree.evaluate(1000).move;

        var target = this.props.battle.unitsById[move.targetId];

        this.handleAbilityUse(move.ability, target);
      },

      finishBattle: function()
      {
        var battle = this.props.battle;
        if (!battle.ended) throw new Error();

        battle.finishBattle();
      },

      handleMouseEnterAbility: function(ability)
      {
        console.log(Date.now(), "enter ability", ability.displayName);
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
        console.log(Date.now(), "leave ability");
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
          !this.state.playingBattleEffect &&
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
            activeUnit: battle.activeUnit,
            targetUnit: this.state.hoveredUnit,
            parentElement: this.state.abilityTooltip.parentElement,
            facesLeft: this.state.abilityTooltip.facesLeft,
            activeTargets: activeTargets,
            ref: "abilityTooltip",
            key: this.state.hoveredUnit.id
          });
        };

        var activeEffectUnits = [];
        if (this.state.playingBattleEffect)
        {
          activeEffectUnits = [this.state.battleSceneUnit1, this.state.battleSceneUnit2];
        }

        var upperFooterElement;
        if (!this.state.playingBattleEffect)
        {
          upperFooterElement = UIComponents.TurnOrder(
          {
            key: "turnOrder",
            turnOrder: battle.turnOrder,
            unitsBySide: battle.unitsBySide,
            potentialDelay: this.state.potentialDelay,
            hoveredUnit: this.state.hoveredUnit,
            onMouseEnterUnit: this.handleMouseEnterUnit,
            onMouseLeaveUnit: this.handleMouseLeaveUnit
          })
        }
        else
        {
          upperFooterElement = React.DOM.div(
          {
            key: "battleDisplayStrength",
            className: "battle-display-strength-container"
          },
            React.DOM.div(
            {
              className: "battle-display-strength battle-display-strength-side1"
            },

              this.state.battleSceneUnit1 ? UIComponents.BattleDisplayStrength(
              {
                key: "" + this.state.battleSceneUnit1.id + Date.now(),
                delay: Options.battleAnimationTiming["effectDuration"],
                from: this.state.battleSceneUnit1StartingStrength,
                to: this.state.battleSceneUnit1.currentHealth
              }) : null
            ),
            React.DOM.div(
            {
              className: "battle-display-strength battle-display-strength-side2"
            },
              this.state.battleSceneUnit2 ? UIComponents.BattleDisplayStrength(
              {
                key: "" + this.state.battleSceneUnit2.id + Date.now(),
                delay: Options.battleAnimationTiming["effectDuration"],
                from: this.state.battleSceneUnit2StartingStrength,
                to: this.state.battleSceneUnit2.currentHealth
              }) : null
            )
          )
        }

        if (this.hoveredUnit) console.log(Date.now(), this.hoveredUnit.id);

        return(
          React.DOM.div(
          {
            className: "battle-pixi-container",
            ref: "pixiContainer"
          },
            React.DOM.div(
            {
              className: "battle-container",
              ref: "battleContainer"
            },
              React.DOM.div(
              {
                className: "battle-upper"
              },
                UIComponents.BattleScore(
                {
                  battle: battle
                }),
                React.addons.CSSTransitionGroup({transitionName: "battle-upper-footer"},
                  upperFooterElement
                ),
                UIComponents.BattleScene(
                {
                  unit1: this.state.battleSceneUnit1,
                  unit2: this.state.battleSceneUnit2
                })
              ),
              React.DOM.div(
              {
                className: "fleets-container",
                ref: "fleetsContainer"
              },
                UIComponents.Fleet(
                {
                  battle: battle,
                  fleet: battle.side1,
                  activeUnit: battle.activeUnit,
                  hoveredUnit: this.state.hoveredUnit,
                  activeTargets: activeTargets,
                  targetsInPotentialArea: this.state.targetsInPotentialArea,
                  handleMouseEnterUnit: this.handleMouseEnterUnit,
                  handleMouseLeaveUnit: this.handleMouseLeaveUnit,
                  activeEffectUnits: activeEffectUnits
                }),
                UIComponents.TurnCounter(
                {
                  turnsLeft: battle.turnsLeft,
                  maxTurns: battle.maxTurns
                }),
                UIComponents.Fleet(
                {
                  battle: battle,
                  fleet: battle.side2,
                  facesLeft: true,
                  activeUnit: battle.activeUnit,
                  hoveredUnit: this.state.hoveredUnit,
                  activeTargets: activeTargets,
                  targetsInPotentialArea: this.state.targetsInPotentialArea,
                  handleMouseEnterUnit: this.handleMouseEnterUnit,
                  handleMouseLeaveUnit: this.handleMouseLeaveUnit,
                  activeEffectUnits: activeEffectUnits
                }),
                abilityTooltip,
                this.state.playingBattleEffect ?
                  React.DOM.div({className: "battle-fleets-darken"}, null):
                  null
              ),
              battle.ended ? React.DOM.button(
              {
                className: "end-battle-button",
                onClick: this.finishBattle
              }, "end") : null
            )
          )
        );
      }
    });
  }
}