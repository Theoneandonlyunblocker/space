import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {AbilityTargetDisplayDataById} from "core/src/abilities/AbilityTargetDisplayData";
import {AbilityUseEffectQueue} from "core/src/abilities/AbilityUseEffectQueue";
import {Battle as BattleObj} from "core/src/battle/Battle";
import {BattleScene as BattleSceneObj} from "core/src/battle/BattleScene";
import {options} from "core/src/app/Options";
import {Player} from "core/src/player/Player";
import {Unit} from "core/src/unit/Unit";
import {UnitDisplayData} from "core/src/unit/UnitDisplayData";
import {activeModuleData} from "core/src/app/activeModuleData";
import
{
  getAbilityTargetDisplayData,
  getTargetsForAllAbilities,
} from "core/src/abilities/battleAbilityDisplay";
import
{
  useAbilityAndGetUseEffects,
} from "core/src/abilities/battleAbilityUsage";
import {AbilityUseEffect} from "core/src/abilities/AbilityUseEffect";
import {CombatAbilityTemplate} from "core/src/templateinterfaces/CombatAbilityTemplate";

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
  // TODO 2021.11.02 | doesn't belong here
  humanPlayer: Player;
  onAbilityUse: (
    ability: CombatAbilityTemplate,
    user: Unit,
    target: Unit,
    abilityUseWasByHuman: boolean,
  ) => void;
  handleAiTurn: () => void;
}

interface StateType
{
  UIState: BattleUIState;

  highlightedUnit: Unit | null;
  hoveredUnit: Unit | null;
  hoveredAbility: CombatAbilityTemplate | null;
  abilityTargetDisplayDataById: AbilityTargetDisplayDataById;
  potentialDelayId: number;
  potentialDelayAmount: number;

  abilityTooltip:
  {
    parentElement?: HTMLElement;
    isFacingRight?: boolean;
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
  // TODO 2020.07.20 | temporarily disabled
  // tslint:disable:member-ordering
  public displayName: string = "Battle";
  public override state: StateType;

  private readonly formationsContainer = React.createRef<HTMLDivElement>();
  private readonly abilityTooltip = React.createRef<AbilityTooltipComponent>();
  private readonly background = React.createRef<BattleBackgroundComponent>();

  private battleScene: BattleSceneObj;
  private abilityUseEffectQueue: AbilityUseEffectQueue;

  // set as a property of the class instead of its state
  // as its not used to trigger updates and needs to be changed synchronously
  private tempHoveredUnit: Unit = null;

  private vfxStartTime: number;
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
      onVfxStart: () =>
      {
        this.vfxStartTime = Date.now();
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
        isFacingRight: null,
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

  public override componentDidMount()
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
    else
    {
      this.props.battle.combatManager.advancePhase();
      this.handleTurnStart();
    }

    // TODO 2020.07.19 | unnecessary, right? these are all done in handleTurnStart()
    // TODO 2021.11.02 | migrate them there, though
    //
    // if (Date.now() < this.battleStartStartTime + 1000)
    // {
      // return;
    // }
    // else if (this.props.battle.ended)
    // {
    //   this.setState(
    //   {
    //     UIState: BattleUIState.BattleEnding,
    //   });
    // }
    // else
    // {
    //   this.setState(
    //   {
    //     UIState: BattleUIState.Idle,
    //   }, () =>
    //   {
    //     this.battleScene.activeUnit = this.props.battle.activeUnit;
    //     this.battleScene.updateUnits();
    //     if (this.tempHoveredUnit)
    //     {
    //       this.handleMouseEnterUnit(this.tempHoveredUnit);
    //     }
    //     if (this.props.battle.getActivePlayer() !== this.props.humanPlayer)
    //     {
    //       this.useAiAbility();
    //     }
    //   });
    // }


  }
  private getBlurArea()
  {
    return this.formationsContainer.current.getBoundingClientRect();
  }
  private clearHoveredUnit()
  {
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

    const nativeEvent = e.nativeEvent;

    // TODO 2019.11.06 | remove toElement? idk if any browser uses it anymore
    const toElement = (nativeEvent as any).toElement || <HTMLElement> nativeEvent.relatedTarget;

    if (!toElement)
    {
      this.tempHoveredUnit = null;
      this.clearHoveredUnit();

      return;
    }

    if (!this.abilityTooltip.current)
    {
      this.tempHoveredUnit = null;
      this.clearHoveredUnit();

      return;
    }

    const tooltipElement = this.abilityTooltip.current.ownDOMNode.current;
    const movedToTooltipElement = (
      toElement === this.state.abilityTooltip.parentElement ||
      (this.abilityTooltip && toElement === tooltipElement) ||
      toElement.parentElement === tooltipElement
    );

    if (!movedToTooltipElement)
    {
      this.tempHoveredUnit = null;
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

    const isFacingRight = unit.battleStats.side === "side1";
    const parentElement = this.getUnitElement(unit);

    this.setState(
    {
      abilityTooltip:
      {
        parentElement: parentElement,
        isFacingRight: isFacingRight,
      },
      hoveredUnit: unit,
      highlightedUnit: unit,
    });

    this.battleScene.hoveredUnit = unit;
    this.battleScene.updateUnits();
  }
  private handleMouseEnterAbility(ability: CombatAbilityTemplate)
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
  public handleAbilityUse(ability: CombatAbilityTemplate, target: Unit, wasByPlayer: boolean)
  {
    const user = this.props.battle.activeUnit;

    const abilityUseEffects = useAbilityAndGetUseEffects(
      this.props.battle,
      ability,
      this.props.battle.activeUnit,
      target,
    );

    this.abilityUseEffectQueue.addEffects(abilityUseEffects);

    if (this.props.onAbilityUse)
    {
      this.props.onAbilityUse(ability, user, target, wasByPlayer);
    }

    this.playQueuedBattleEffects();
  }
  private static getUnitsBySideFromEffect(effect: AbilityUseEffect)
  {
    const userSide = effect.vfxUser.battleStats.side;
    const targetSide = effect.vfxTarget.battleStats.side;

    return(
    {
      side1: (targetSide === "side1" ? effect.vfxTarget :
        (userSide === "side1" ? effect.vfxUser : null)),
      side2: (targetSide === "side2" ? effect.vfxTarget :
        (userSide === "side2" ? effect.vfxUser : null)),
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
      UIState: BattleUIState.PlayingVfx,
      battleEffectDuration: effect.vfx.duration * options.battle.animationTiming.effectDuration,
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
      previousUnitDisplayDataById: {...this.state.unitDisplayDataById},
      unitDisplayDataById: {
        ...this.state.unitDisplayDataById,
        ...effect.changedUnitDisplayData,
      },
      battleEvaluation: effect.newEvaluation,
      battleEffectDurationAfterTrigger: this.state.battleEffectDuration -
        (Date.now() - this.vfxStartTime),
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

    this.battleScene.activeUnit = null;
    this.battleScene.updateUnits(() =>
    {
      setTimeout(cb, options.battle.animationTiming.turnTransition);
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
      this.props.handleAiTurn();
    }
    else
    {
      this.battleScene.activeUnit = this.props.battle.activeUnit;
      this.battleScene.updateUnits();

      this.setState(
      {
        UIState: BattleUIState.Idle,
      }, () =>
      {
        if (this.tempHoveredUnit)
        {
          this.handleMouseEnterUnit(this.tempHoveredUnit);
        }
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
  private usePlayerAbility(ability: CombatAbilityTemplate, target: Unit)
  {
    this.handleAbilityUse(ability, target, true);
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

  public override render()
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
        isFacingRight: this.state.abilityTooltip.isFacingRight,
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
              isFacingRight: true,

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
              isFacingRight: false,

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
