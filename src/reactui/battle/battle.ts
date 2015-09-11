/// <reference path="fleet.ts"/>
/// <reference path="turncounter.ts"/>
/// <reference path="turnorder.ts"/>
/// <reference path="abilitytooltip.ts"/>
/// <reference path="battlescore.ts"/>
/// <reference path="battlescene.ts"/>
/// <reference path="battledisplaystrength.ts"/>
/// <reference path="battlebackground.ts"/>

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
          playingBattleEffectActive: false,
          battleEffectDuration: null,
          battleEffectSFX: null
        });
      },
      getBlurArea: function()
      {
        return this.refs.fleetsContainer.getDOMNode().getBoundingClientRect();
      },

      componentDidMount: function()
      {
        this.setBattleSceneUnits(this.state.hoveredUnit);

        if (this.props.battle.getActivePlayer() !== this.props.humanPlayer)
        {
          this.useAIAbility();
        }
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
      handleMouseLeaveUnit: function(e: React.MouseEvent)
      {
        this.tempHoveredUnit = null;

        if (!this.state.hoveredUnit || this.state.playingBattleEffect) return;

        var nativeEvent = <MouseEvent> e.nativeEvent;

        var toElement = nativeEvent.toElement || <HTMLElement> nativeEvent.relatedTarget;

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
      handleMouseEnterUnit: function(unit: Unit)
      {
        this.tempHoveredUnit = unit;

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

      getUnitElement: function(unit: Unit)
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

        var unit1: Unit, unit2: Unit;

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

      handleAbilityUse: function(ability: Templates.IAbilityTemplate, target: Unit)
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
        var self = this;
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

        effectData[i].user.sfxDuration = null;
        effectData[i].target.sfxDuration = null;

        if (effectData[i].trigger && !effectData[i].trigger(effectData[i].user, effectData[i].target))
        {
          return this.playBattleEffect(abilityData, i + 1);
        }

        var side1Unit: Unit = null;
        var side2Unit: Unit = null;
        [effectData[i].user, effectData[i].target].forEach(function(unit: Unit)
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
        }

        var beforeDelay = 500 * Options.battleAnimationTiming["before"];

        var effectDuration = 0;
        var effectDelay = 0;
        if (effectData[i].sfx)
        {
          effectDuration = effectData[i].sfx.duration * Options.battleAnimationTiming["effectDuration"];
          effectDuration = effectDuration / (1 + Math.log(i + 1));
          if (effectData[i].sfx.delay)
          {
            effectDelay = effectDuration * effectData[i].sfx.delay;
          }
        }

        effectData[i].user.sfxDuration = effectDuration;
        effectData[i].target.sfxDuration = effectDuration;

        var afterDelay = 500 * Options.battleAnimationTiming["after"];

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


        var finishEffectFN = this.playBattleEffect.bind(this, abilityData, i + 1);

        var callEffectsFN = function(forceUpdate: boolean = true)
        {
          for (var j = 0; j < effectData[i].effects.length; j++)
          {
            effectData[i].effects[j]();
          }
          if (forceUpdate)
          {
            self.forceUpdate();
          }
        }

        var startEffectFN = function()
        {
          console.log("startEffectFN", Date.now());
          if (effectDelay > 0)
          {
            window.setTimeout(callEffectsFN, effectDelay);
          }
          else
          {
            callEffectsFN(false);
          }

          this.setState(
          {
            playingBattleEffectActive: true,
            battleEffectDuration: effectDuration,
            battleEffectSFX: effectData[i].sfx
          });

          window.setTimeout(finishEffectFN, effectDuration + afterDelay);
        }.bind(this);

        console.log("setStartEffectFN", Date.now(), Date.now() + beforeDelay);
        window.setTimeout(startEffectFN, beforeDelay);
      },
      clearBattleEffect: function()
      {
        this.setState(
        {
          playingBattleEffect: false,
          battleEffectDuration: null,
          battleEffectSFX: null,
          hoveredUnit: null
        });

        if (this.tempHoveredUnit)
        {
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

      handleMouseEnterAbility: function(ability: Templates.IAbilityTemplate)
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

        var activeEffectUnits: Unit[] = [];
        if (this.state.playingBattleEffect)
        {
          activeEffectUnits = [this.state.battleSceneUnit1, this.state.battleSceneUnit2];
        }

        var upperFooterElement: ReactComponentPlaceHolder;
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
                delay: this.state.battleEffectDuration,
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
                delay: this.state.battleEffectDuration,
                from: this.state.battleSceneUnit2StartingStrength,
                to: this.state.battleSceneUnit2.currentHealth
              }) : null
            )
          )
        }

        // hack
        // 
        // transitiongroups dont work very well, especially in the older version
        // of react we're using. seems to be mostly fine on webkit & ie though
        // so just disable it on firefox for now
        var upperFooter = navigator.userAgent.indexOf("Firefox") === -1 ?
          React.addons.CSSTransitionGroup({transitionName: "battle-upper-footer"},
            upperFooterElement
          ) : upperFooterElement;

        return(
          UIComponents.BattleBackground(
          {
            renderer: this.props.renderer,
            backgroundSeed: this.props.battle.battleData.location.getSeed(),
            getBlurArea: this.getBlurArea
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
                upperFooter,
                UIComponents.BattleScene(
                {
                  unit1: this.state.battleSceneUnit1,
                  unit2: this.state.battleSceneUnit2,
                  effectDuration: this.state.battleEffectDuration,
                  effectSFX: this.state.battleEffectSFX,
                  unit1IsActive: this.state.battleSceneUnit1 === battle.activeUnit,
                  playingBattleEffect: this.state.playingBattleEffect
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
                  hoveredAbility: this.state.hoveredAbility,
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
                  hoveredAbility: this.state.hoveredAbility,
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