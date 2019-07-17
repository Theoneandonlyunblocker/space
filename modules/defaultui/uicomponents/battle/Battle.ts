import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {AbilityTargetDisplayDataById} from "../../../../src/AbilityTargetDisplayData";
import {AbilityUseEffectQueue} from "../../../../src/AbilityUseEffectQueue";
import {Battle as BattleObj} from "../../../../src/Battle";
import {BattleScene as BattleSceneObj} from "../../../../src/BattleScene";
import {MCTree} from "../../../../src/MCTree";
import {options} from "../../../../src/Options";
import {Player} from "../../../../src/Player";
import {Unit} from "../../../../src/Unit";
import {UnitDisplayData} from "../../../../src/UnitDisplayData";
import {activeModuleData} from "../../../../src/activeModuleData";
import
{
  getAbilityTargetDisplayData,
  getTargetsForAllAbilities,
} from "../../../../src/battleAbilityDisplay";
import
{
  AbilityUseEffect,
  useAbilityAndGetUseEffects,
} from "../../../../src/battleAbilityUsage";
import {AbilityTemplate} from "../../../../src/templateinterfaces/AbilityTemplate";
import
{
  shallowCopy,
  shallowExtend,
} from "../../../../src/utility";

import
{
  AbilityTooltipComponent,
  AbilityTooltip,
  PropTypes as AbilityTooltipProps,
} from "./AbilityTooltip";
import {BattleBackgroundComponent, BattleBackground} from "./BattleBackground";
import {BattleDisplayStrength} from "./BattleDisplayStrength";
import {BattleScene} from "./BattleScene";
import {BattleScore} from "./BattleScore";
import {BattleUIState} from "./BattleUIState";
import {Formation} from "./Formation";
import {TurnCounterList} from "./TurnCounterList";
import {TurnOrder} from "./TurnOrder";


export interface PropTypes extends React.Props<any>
{
  battle: BattleObj;
  humanPlayer: Player;
}

interface StateType
{
  UIState: BattleUIState;

  highlightedUnit: Unit | null;
  hoveredUnit: Unit | null;
  hoveredAbility: AbilityTemplate | null;
  abilityTargetDisplayDataById: AbilityTargetDisplayDataById;
  potentialDelayId: number;
  potentialDelayAmount: number;

  abilityTooltip:
  {
    parentElement?: HTMLElement;
    facesLeft?: boolean;
  };

  battleSceneUnit1: Unit;
  battleSceneUnit2: Unit;
  playingBattleEffect: boolean;
  battleEffectDuration: number;
  battleEffectDurationAfterTrigger: number;

  battleEvaluation: number;
  unitDisplayDataById: {[unitId: number]: UnitDisplayData};
  previousUnitDisplayDataById: {[unitId: number]: UnitDisplayData};
}

export class BattleComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "Battle";
  public state: StateType;

  private readonly formationsContainer = React.createRef<HTMLDivElement>();
  private readonly abilityTooltip = React.createRef<AbilityTooltipComponent>();
  private readonly background = React.createRef<BattleBackgroundComponent>();

  private battleScene: BattleSceneObj;
  private abilityUseEffectQueue: AbilityUseEffectQueue;

  // set as a property of the class instead of its state
  // as its not used to trigger updates
  // and needs to be changed synchronously
  private tempHoveredUnit: Unit = null;

  // TODO 2018.04.14 | really doesn't belong in ui class
  private mcTree: MCTree = null;

  private sfxStartTime: number;
  private battleStartStartTime: number;
  private battleEndStartTime: number;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();
    this.bindMethods();

    this.battleScene = new BattleSceneObj();

    this.abilityUseEffectQueue = new AbilityUseEffectQueue(this.battleScene,
    {
      onEffectStart: this.setStateForBattleEffect,
      onSfxStart: () =>
      {
        this.sfxStartTime = Date.now();
      },
      onEffectTrigger: this.onBattleEffectTrigger,
      onCurrentFinished: this.playQueuedBattleEffects,
      onAllFinished: this.finishPlayingQueuedBattleEffects,
    });
  }
  private bindMethods()
  {
    this.clearHoveredUnit = this.clearHoveredUnit.bind(this);
    this.getBlurArea = this.getBlurArea.bind(this);
    this.handleMouseEnterUnit = this.handleMouseEnterUnit.bind(this);
    this.handleMouseEnterAbility = this.handleMouseEnterAbility.bind(this);
    this.usePreparedAbility = this.usePreparedAbility.bind(this);
    this.useAiAbility = this.useAiAbility.bind(this);
    this.handleMouseLeaveAbility = this.handleMouseLeaveAbility.bind(this);
    this.endTurn = this.endTurn.bind(this);
    this.startTurn = this.startTurn.bind(this);
    this.handleTurnStart = this.handleTurnStart.bind(this);
    this.handleMouseLeaveUnit = this.handleMouseLeaveUnit.bind(this);
    this.usePlayerAbility = this.usePlayerAbility.bind(this);
    this.endBattleStart = this.endBattleStart.bind(this);
    this.getUnitElement = this.getUnitElement.bind(this);
    this.handleAbilityUse = this.handleAbilityUse.bind(this);
    this.finishBattle = this.finishBattle.bind(this);

    this.setStateForBattleEffect = this.setStateForBattleEffect.bind(this);
    this.playQueuedBattleEffects = this.playQueuedBattleEffects.bind(this);
    this.finishPlayingQueuedBattleEffects = this.finishPlayingQueuedBattleEffects.bind(this);
    this.onBattleEffectTrigger = this.onBattleEffectTrigger.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    const initialDisplayData: {[unitId: number]: UnitDisplayData} = {};
    this.props.battle.forEachUnit(unit =>
    {
      initialDisplayData[unit.id] = unit.getDisplayData("battle");
    });

    return(
    {
      UIState: BattleUIState.BattleStarting,

      highlightedUnit: null,
      hoveredUnit: null,
      hoveredAbility: null,
      abilityTargetDisplayDataById: {},
      potentialDelayId: undefined,
      potentialDelayAmount: undefined,

      abilityTooltip:
      {
        parentElement: null,
        facesLeft: null,
      },

      battleSceneUnit1: null,
      battleSceneUnit2: null,
      playingBattleEffect: false,
      battleEffectDuration: null,
      battleEffectDurationAfterTrigger: undefined,

      battleEvaluation: this.props.battle.getEvaluation(),
      unitDisplayDataById: initialDisplayData,
      previousUnitDisplayDataById: initialDisplayData,
    });
  }

  componentDidMount()
  {
    this.battleStartStartTime = Date.now();
    this.background.current.handleResize();
  }

  private endBattleStart()
  {
    if (Date.now() < this.battleStartStartTime + 1000)
    {
      return;
    }
    else if (this.props.battle.ended)
    {
      this.setState(
      {
        UIState: BattleUIState.BattleEnding,
      });
    }
    else
    {
      this.setState(
      {
        UIState: BattleUIState.Idle,
      }, () =>
      {
        this.battleScene.activeUnit = this.props.battle.activeUnit;
        this.battleScene.updateUnits();
        if (this.tempHoveredUnit)
        {
          this.handleMouseEnterUnit(this.tempHoveredUnit);
        }
        if (this.props.battle.getActivePlayer() !== this.props.humanPlayer)
        {
          this.useAiAbility();
        }
      });
    }


  }
  private getBlurArea()
  {
    return this.formationsContainer.current.getBoundingClientRect();
  }
  private clearHoveredUnit()
  {
    this.tempHoveredUnit = null;
    this.setState(
    {
      hoveredUnit: null,
      highlightedUnit: null,
      abilityTooltip:
      {
        parentElement: null,
      },
      hoveredAbility: null,
      potentialDelayId: undefined,
      potentialDelayAmount: undefined,
      abilityTargetDisplayDataById: {},
    });

    this.battleScene.hoveredUnit = null;
    if (this.state.UIState === BattleUIState.Idle)
    {
      this.battleScene.updateUnits();
    }
  }
  private handleMouseLeaveUnit(e: React.MouseEvent<HTMLDivElement>)
  {
    if (!this.state.hoveredUnit || this.state.playingBattleEffect)
    {
      this.tempHoveredUnit = null;

      return;
    }

    const nativeEvent = <MouseEvent> e.nativeEvent;

    const toElement = nativeEvent.toElement || <HTMLElement> nativeEvent.relatedTarget;

    if (!toElement)
    {
      this.clearHoveredUnit();

      return;
    }

    if (!this.abilityTooltip)
    {
      this.clearHoveredUnit();

      return;
    }


    const tooltipElement = this.abilityTooltip.current.ownDOMNode.current;

    if (
      toElement !== this.state.abilityTooltip.parentElement &&
      (this.abilityTooltip && toElement !== tooltipElement) &&
      toElement.parentElement !== tooltipElement
    )
    {
      this.clearHoveredUnit();
    }
  }
  private handleMouseEnterUnit(unit: Unit)
  {
    this.tempHoveredUnit = unit;

    if (this.state.UIState !== BattleUIState.Idle)
    {
      return;
    }

    const facesLeft = unit.battleStats.side === "side2";
    const parentElement = this.getUnitElement(unit);

    this.setState(
    {
      abilityTooltip:
      {
        parentElement: parentElement,
        facesLeft: facesLeft,
      },
      hoveredUnit: unit,
      highlightedUnit: unit,
    });

    this.battleScene.hoveredUnit = unit;
    this.battleScene.updateUnits();
  }
  private handleMouseEnterAbility(ability: AbilityTemplate)
  {
    const targetDisplayDataForAbility = getAbilityTargetDisplayData(
      this.props.battle,
      ability,
      this.props.battle.activeUnit,
      this.state.hoveredUnit,
    );

    const abilityUseDelay = ability.preparation ?
      ability.preparation.prepDelay * ability.preparation.turnsToPrep :
      ability.moveDelay;

    this.setState(
    {
      hoveredAbility: ability,
      potentialDelayId: this.props.battle.activeUnit.id,
      potentialDelayAmount: this.props.battle.activeUnit.battleStats.moveDelay + abilityUseDelay,
      abilityTargetDisplayDataById: targetDisplayDataForAbility,
    });
  }
  private handleMouseLeaveAbility()
  {
    this.setState(
    {
      hoveredAbility: null,
      potentialDelayId: undefined,
      potentialDelayAmount: undefined,
      abilityTargetDisplayDataById: {},
    });
  }
  private getUnitElement(unit: Unit)
  {
    return document.getElementById("unit-id_" + unit.id);
  }
  private handleAbilityUse(ability: AbilityTemplate, target: Unit, wasByPlayer: boolean)
  {
    const user = this.props.battle.activeUnit;

    const abilityUseEffects = useAbilityAndGetUseEffects(
      this.props.battle,
      ability,
      this.props.battle.activeUnit,
      target,
    );

    this.abilityUseEffectQueue.addEffects(abilityUseEffects);

    if (wasByPlayer && this.mcTree)
    {
      this.mcTree.advanceMove(
      {
        ability: ability,
        userId: user.id,
        targetId: target.id,
      }, 0.25);
    }


    this.playQueuedBattleEffects();
  }
  private static getUnitsBySideFromEffect(effect: AbilityUseEffect)
  {
    const userSide = effect.sfxUser.battleStats.side;
    const targetSide = effect.sfxTarget.battleStats.side;

    return(
    {
      side1: (targetSide === "side1" ? effect.sfxTarget :
        (userSide === "side1" ? effect.sfxUser : null)),
      side2: (targetSide === "side2" ? effect.sfxTarget :
        (userSide === "side2" ? effect.sfxUser : null)),
    });
  }
  private setStateForBattleEffect(effect: AbilityUseEffect)
  {
    const units = BattleComponent.getUnitsBySideFromEffect(effect);
    this.setState(
    {
      battleSceneUnit1: units.side1,
      battleSceneUnit2: units.side2,
      playingBattleEffect: true,
      UIState: BattleUIState.PlayingSfx,
      battleEffectDuration: effect.sfx.duration * options.battle.animationTiming.effectDuration,
    }, this.clearHoveredUnit);
  }
  private playQueuedBattleEffects()
  {
    this.abilityUseEffectQueue.playOnce();
  }
  private onBattleEffectTrigger(effect: AbilityUseEffect)
  {
    this.setState(
    {
      previousUnitDisplayDataById: shallowCopy(this.state.unitDisplayDataById),
      unitDisplayDataById: shallowExtend(
        this.state.unitDisplayDataById, effect.changedUnitDisplayDataById),
      battleEvaluation: effect.newEvaluation,
      battleEffectDurationAfterTrigger: this.state.battleEffectDuration -
        (Date.now() - this.sfxStartTime),
    });
  }
  private finishPlayingQueuedBattleEffects()
  {
    this.setState(
    {
      battleSceneUnit1: null,
      battleSceneUnit2: null,
      playingBattleEffect: false,
      battleEffectDuration: undefined,
      battleEffectDurationAfterTrigger: undefined,
    }, () =>
    {
      this.endTurn(this.startTurn);
    });
  }
  private endTurn(cb: () => void): void
  {
    if (!this.state.hoveredUnit || !this.state.hoveredUnit.isTargetable())
    {
      this.clearHoveredUnit();
    }

    this.props.battle.endTurn();
    // TODO 2018.04.14 | should start calculating next ai move here

    this.battleScene.activeUnit = null;
    this.battleScene.updateUnits(() =>
    {
      window.setTimeout(cb, options.battle.animationTiming.turnTransition);
      this.setState(
      {
        UIState: BattleUIState.TransitioningTurn,
      });
    });
  }
  private startTurn(): void
  {
    this.battleScene.activeUnit = this.props.battle.activeUnit;
    this.battleScene.updateUnits(() =>
    {
      this.handleTurnStart();
    });
  }
  private handleTurnStart(): void
  {
    if (this.props.battle.ended)
    {
      this.setState(
      {
        UIState: BattleUIState.BattleEnding,
      });
    }
    else if (this.props.battle.activeUnit && this.props.battle.activeUnit.battleStats.queuedAction)
    {
      this.usePreparedAbility();
    }
    else if (this.props.battle.getActivePlayer() !== this.props.humanPlayer)
    {
      this.useAiAbility();
    }
    else
    {
      this.battleScene.activeUnit = this.props.battle.activeUnit;
      this.battleScene.updateUnits();

      this.setState(
      {
        UIState: BattleUIState.Idle,
      });
    }
  }
  private usePreparedAbility()
  {
    const unit: Unit = this.props.battle.activeUnit;
    const action = unit.battleStats.queuedAction;

    const target = this.props.battle.unitsById[action.targetId];
    const userIsHuman = this.props.battle.getActivePlayer() === this.props.humanPlayer;

    this.handleAbilityUse(action.ability, target, userIsHuman);
  }
  private usePlayerAbility(ability: AbilityTemplate, target: Unit)
  {
    this.handleAbilityUse(ability, target, true);
  }
  private useAiAbility()
  {
    if (!this.props.battle.activeUnit || this.props.battle.ended)
    {
      return;
    }

    if (!this.mcTree)
    {
      this.mcTree = new MCTree(this.props.battle, this.props.battle.activeUnit.battleStats.side);
    }

    const iterations = Math.max(
      options.debug.aiVsPlayerBattleSimulationDepth,
      this.mcTree.rootNode.getPossibleMoves(this.props.battle).length * Math.sqrt(options.debug.aiVsPlayerBattleSimulationDepth),
    );

    const move = this.mcTree.getBestMoveAndAdvance(iterations, 0.25);

    const target = this.props.battle.unitsById[move.targetId];

    this.handleAbilityUse(move.ability, target, false);
  }
  private finishBattle()
  {
    if (Date.now() < this.battleEndStartTime + 1000)
    {
      return;
    }

    // unmounts this component and changes scene
    this.props.battle.finishBattle();
  }

  render()
  {
    const battle = this.props.battle;

    const playerCanAct = this.state.UIState === BattleUIState.Idle;
    const activeTargets = playerCanAct ? getTargetsForAllAbilities(battle, battle.activeUnit) : undefined;

    let abilityTooltip: React.ReactElement<AbilityTooltipProps> = null;

    if (
      playerCanAct &&
      this.state.hoveredUnit &&
      activeTargets[this.state.hoveredUnit.id]
    )
    {
      abilityTooltip = AbilityTooltip(
      {
        handleAbilityUse: this.usePlayerAbility,
        handleMouseLeave: this.handleMouseLeaveUnit,
        handleMouseEnterAbility: this.handleMouseEnterAbility,
        handleMouseLeaveAbility: this.handleMouseLeaveAbility,
        targetUnit: this.state.hoveredUnit,
        parentElement: this.state.abilityTooltip.parentElement,
        facesLeft: this.state.abilityTooltip.facesLeft,
        activeTargets: activeTargets,
        ref: this.abilityTooltip,
        key: this.state.hoveredUnit.id,
      });
    }

    let activeEffectUnits: Unit[] = [];
    if (this.state.playingBattleEffect)
    {
      activeEffectUnits = [this.state.battleSceneUnit1, this.state.battleSceneUnit2];
    }

    let upperFooterElement: React.ReactElement<any>;
    if (this.state.UIState === BattleUIState.BattleStarting)
    {
      upperFooterElement = null;
    }
    else if (!this.state.playingBattleEffect)
    {
      upperFooterElement = TurnOrder(
      {
        key: "turnOrder",
        unitsBySide: battle.unitsBySide,

        turnOrderDisplayData: battle.turnOrder.getDisplayData(),
        hoveredUnit: this.state.highlightedUnit,
        hoveredGhostIndex: isFinite(this.state.potentialDelayAmount) ?
          battle.turnOrder.getGhostIndex(
            this.state.potentialDelayAmount,
            this.state.potentialDelayId,
          ) :
          undefined,

        onMouseEnterUnit: this.handleMouseEnterUnit,
        onMouseLeaveUnit: this.handleMouseLeaveUnit,

        turnIsTransitioning: this.state.UIState === BattleUIState.TransitioningTurn,
        transitionDuration: options.battle.animationTiming.turnTransition / 2,
      });
    }
    else
    {
      upperFooterElement = ReactDOMElements.div(
      {
        key: "battleDisplayStrength",
        className: "battle-display-strength-container",
      },
        ReactDOMElements.div(
        {
          className: "battle-display-strength battle-display-strength-side1",
        },
          this.state.battleSceneUnit1 ? BattleDisplayStrength(
          {
            key: "battleDisplayStrength" + this.state.battleSceneUnit1.id,
            animationDuration: this.state.battleEffectDurationAfterTrigger,
            from: this.state.previousUnitDisplayDataById[this.state.battleSceneUnit1.id].currentHealth,
            to: this.state.unitDisplayDataById[this.state.battleSceneUnit1.id].currentHealth,
          }) : null,
        ),
        ReactDOMElements.div(
        {
          className: "battle-display-strength battle-display-strength-side2",
        },
          this.state.battleSceneUnit2 ? BattleDisplayStrength(
          {
            key: "battleDisplayStrength" + this.state.battleSceneUnit2.id,
            animationDuration: this.state.battleEffectDurationAfterTrigger,
            from: this.state.previousUnitDisplayDataById[this.state.battleSceneUnit2.id].currentHealth,
            to: this.state.unitDisplayDataById[this.state.battleSceneUnit2.id].currentHealth,
          }) : null,
        ),
      );
    }

    // is this still relevant? written for react-0.11
    // TODO react | TODO hack
    //
    // transitiongroups dont work very well, especially in the older version
    // of react we're using. seems to be mostly fine on webkit & ie though
    // so just disable it on firefox for now
    // const upperFooter = navigator.userAgent.indexOf("Firefox") === -1 ?
    //   React.addons.CSSTransitionGroup({transitionName: "battle-upper-footer"},
    //     upperFooterElement
    //   ) : upperFooterElement;
    const upperFooter = upperFooterElement;

    const containerProps: React.HTMLAttributes<HTMLDivElement> =
    {
      className: "battle-container",
    };
    let playerWonBattle: boolean = null;
    if (this.state.UIState === BattleUIState.BattleStarting)
    {
      containerProps.className += " battle-start-overlay";
      containerProps.onClick = this.endBattleStart;
    }
    else if (battle.ended)
    {
      if (!this.battleEndStartTime)
      {
        this.battleEndStartTime = Date.now();
      }

      containerProps.className += " battle-start-overlay";
      containerProps.onClick = this.finishBattle;

      playerWonBattle = this.props.humanPlayer === battle.getVictor();
    }

    let battleState: "start" | "active" | "finish";
    if (this.state.UIState === BattleUIState.BattleStarting)
    {
      battleState = "start";
    }
    else if (this.state.UIState === BattleUIState.BattleEnding)
    {
      battleState = "finish";
    }
    else
    {
      battleState = "active";
    }

    return(
      BattleBackground(
      {
        backgroundSeed: this.props.battle.battleData.location.seed,
        backgroundDrawingFunction: activeModuleData.starBackgroundDrawingFunction,
        getBlurArea: this.getBlurArea,
        ref: this.background,
      },
        ReactDOMElements.div(containerProps,
          ReactDOMElements.div(
          {
            className: "battle-upper",
          },
            BattleScore(
            {
              evaluation: this.state.battleEvaluation,
              player1: battle.side1Player,
              player2: battle.side2Player,
              animationDuration: this.state.battleEffectDurationAfterTrigger,
            }),
            upperFooter,
            BattleScene(
            {
              battleState: battleState,
              battleScene: this.battleScene,
              humanPlayerWonBattle: playerWonBattle,

              flag1: battle.side1Player.flag,
              flag2: battle.side2Player.flag,
            }),
          ),
          ReactDOMElements.div(
          {
            className: "formations-container",
            ref: this.formationsContainer,
          },
            Formation(
            {
              unitDisplayDataById: this.state.unitDisplayDataById,
              formation: battle.side1,
              facesLeft: false,

              handleMouseEnterUnit: this.handleMouseEnterUnit,
              handleMouseLeaveUnit: this.handleMouseLeaveUnit,

              isInBattlePrep: false,
              hoveredUnit: this.state.highlightedUnit,
              activeUnit: battle.activeUnit,
              abilityTargetDisplayDataById: this.state.abilityTargetDisplayDataById,
              activeEffectUnits: activeEffectUnits,
              hoveredAbility: this.state.hoveredAbility,

              capturedUnits: this.props.battle.capturedUnits,
              destroyedUnits: this.props.battle.deadUnits,
              unitStrengthAnimateDuration: this.state.battleEffectDurationAfterTrigger,
            }),
            TurnCounterList(
            {
              turnsLeft: battle.turnsLeft,
              maxTurns: battle.maxTurns,
              animationDuration: 100,
            }),
            Formation(
            {
              unitDisplayDataById: this.state.unitDisplayDataById,
              formation: battle.side2,
              facesLeft: true,

              handleMouseEnterUnit: this.handleMouseEnterUnit,
              handleMouseLeaveUnit: this.handleMouseLeaveUnit,

              isInBattlePrep: false,
              hoveredUnit: this.state.highlightedUnit,
              activeUnit: battle.activeUnit,
              abilityTargetDisplayDataById: this.state.abilityTargetDisplayDataById,
              activeEffectUnits: activeEffectUnits,
              hoveredAbility: this.state.hoveredAbility,

              capturedUnits: this.props.battle.capturedUnits,
              destroyedUnits: this.props.battle.deadUnits,
              unitStrengthAnimateDuration: this.state.battleEffectDurationAfterTrigger,
            }),
            abilityTooltip,
            this.state.playingBattleEffect ?
              ReactDOMElements.div({className: "battle-formations-darken"}, null) :
              null,
          ),
        ),
      )
    );
  }
}

export const Battle: React.Factory<PropTypes> = React.createFactory(BattleComponent);
