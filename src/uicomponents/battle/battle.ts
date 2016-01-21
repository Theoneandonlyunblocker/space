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
      idGenerator: 0,
      MCTree: null,
      battleStartStartTime: undefined,
      battleEndStartTime: undefined,

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
          battleEffectId: undefined,
          battleEffectDuration: null,
          battleEffectSFX: null,
          battleIsStarting: true
        });
      },

      componentDidMount: function()
      {
        this.battleStartStartTime = Date.now();
      },

      endBattleStart: function()
      {
        if (Date.now() < this.battleStartStartTime + 1000) return;
        this.setState(
        {
          battleIsStarting: false
        }, this.setBattleSceneUnits(this.state.hoveredUnit));

        if (this.props.battle.getActivePlayer() !== this.props.humanPlayer)
        {
          this.useAIAbility();
        }
      },

      getBlurArea: function()
      {
        return this.refs.fleetsContainer.getDOMNode().getBoundingClientRect();
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

      handleAbilityUse: function(ability: Templates.IAbilityTemplate, target: Unit, wasByPlayer: boolean)
      {
        var abilityData = getAbilityUseData(this.props.battle,
          this.props.battle.activeUnit, ability, target);

        for (var i = 0; i < abilityData.beforeUse.length; i++)
        {
          abilityData.beforeUse[i]();
        }

        this.playBattleEffect(abilityData, 0);


        if (wasByPlayer && this.MCTree)
        {
          this.MCTree.advanceMove(
          {
            ability: ability,
            targetId: "" + abilityData.actualTarget.id
          });
        }
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

        var beforeDelay = 750 * Options.battleAnimationTiming["before"];

        var effectDuration = 0;
        var effectDelay = 0;
        if (effectData[i].sfx)
        {
          effectDuration = effectData[i].sfx.duration * Options.battleAnimationTiming["effectDuration"];
          effectDuration /= (1 + Math.log(i + 1));
          if (effectData[i].sfx.delay)
          {
            effectDelay = effectDuration * effectData[i].sfx.delay;
          }
        }

        effectData[i].user.sfxDuration = effectDuration;
        effectData[i].target.sfxDuration = effectDuration;

        var afterDelay = 1500 * Options.battleAnimationTiming["after"];
        afterDelay /= effectData.length;

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
          if (effectDelay > 0)
          {
            window.setTimeout(callEffectsFN, effectDelay);
            
            this.setState(
            {
              battleEffectId: this.idGenerator++,
              battleEffectDuration: effectDuration,
              battleEffectSFX: effectData[i].sfx
            });
          }
          else
          {
            callEffectsFN(false);
          }


          window.setTimeout(finishEffectFN, effectDuration + afterDelay);
        }.bind(this);

        window.setTimeout(startEffectFN, beforeDelay);
      },
      clearBattleEffect: function()
      {
        this.setState(
        {
          playingBattleEffect: false,
          battleEffectId: undefined,
          battleEffectDuration: null,
          battleEffectSFX: null,
          hoveredUnit: null
        });

        if (this.tempHoveredUnit && this.tempHoveredUnit.isActiveInBattle())
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

        if (this.props.battle.activeUnit && this.props.battle.activeUnit.battleStats.queuedAction)
        {
          this.usePreparedAbility();
        }
        else if (this.props.battle.getActivePlayer() !== this.props.humanPlayer)
        {
          this.useAIAbility();
        }
      },
      usePreparedAbility: function()
      {
        var unit: Unit = this.props.battle.activeUnit;
        var action = unit.battleStats.queuedAction;

        var target = this.props.battle.unitsById[action.targetId];
        var userIsHuman = this.props.battle.getActivePlayer() === this.props.humanPlayer;

        this.handleAbilityUse(action.ability, target, userIsHuman);
      },
      usePlayerAbility: function(ability: Templates.IAbilityTemplate, target: Unit)
      {
        this.handleAbilityUse(ability, target, true);
      },
      useAIAbility: function()
      {
        if (!this.props.battle.activeUnit || this.props.battle.ended) return;
        
        if (!this.MCTree) this.MCTree = new MCTree(this.props.battle,
          this.props.battle.activeUnit.battleStats.side, false);

        var move = this.MCTree.getBestMoveAndAdvance(1000);

        var target = this.props.battle.unitsById[move.targetId];

        this.handleAbilityUse(move.ability, target, false);
      },

      finishBattle: function()
      {
        if (Date.now() < this.battleEndStartTime + 1000) return;
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

        var abilityUseDelay = ability.preparation ?
          ability.preparation.prepDelay * ability.preparation.turnsToPrep :
          ability.moveDelay;

        this.setState(
        {
          hoveredAbility: ability,
          potentialDelay:
          {
            id: this.props.battle.activeUnit.id,
            delay: this.props.battle.activeUnit.battleStats.moveDelay + abilityUseDelay
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
            handleAbilityUse: this.usePlayerAbility,
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
        if (this.state.battleIsStarting)
        {
          upperFooterElement = null;
        }
        else if (!this.state.playingBattleEffect)
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

        var overlayContainer: ReactDOMPlaceHolder = null;
        var playerWonBattle: boolean = null;
        if (this.state.battleIsStarting)
        {
          overlayContainer = React.DOM.div(
          {
            className: "battle-start-overlay",
            onClick: this.endBattleStart
          });
        }
        else if (battle.ended)
        {
          if (!this.battleEndStartTime) this.battleEndStartTime = Date.now();
          overlayContainer = React.DOM.div(
          {
            className: "battle-start-overlay",
            onClick: this.finishBattle
          });
          playerWonBattle = this.props.humanPlayer === battle.getVictor();
        }

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
              overlayContainer,
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
                  effectId: this.state.battleEffectId,
                  battleIsStarting: this.state.battleIsStarting,
                  battleHasEnded: battle.ended,
                  playerWonBattle: playerWonBattle,
                  player1: battle.side1Player,
                  player2: battle.side2Player
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
              )
            )
          )
        );
      }
    });
  }
}