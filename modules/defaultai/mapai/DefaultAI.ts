import DefaultAISaveData from "./DefaultAISaveData";
import DiplomacyAI from "./DiplomacyAI";
import {EconomicAI} from "./EconomicAI";
import FrontsAI from "./FrontsAI";
import {GrandStrategyAI} from "./GrandStrategyAI";
import MapEvaluator from "./MapEvaluator";
import {ObjectivesAI} from "./ObjectivesAI";
import {UnitEvaluator} from "./UnitEvaluator";

import AITemplate from "../../../src/templateinterfaces/AITemplate";

import app from "../../../src/App";
import ArchetypeValues from "../../../src/ArchetypeValues";
import GalaxyMap from "../../../src/GalaxyMap";
import Game from "../../../src/Game";
import Personality from "../../../src/Personality";
import Player from "../../../src/Player";
import {Trade} from "../../../src/Trade";
import {TradeResponse} from "../../../src/TradeResponse";
import Unit from "../../../src/Unit";
import getNullFormation from "../../../src/getNullFormation";
import
{
  makeRandomPersonality,
} from "../../../src/utility";

export default class DefaultAI implements AITemplate<DefaultAISaveData>
{
  public static readonly type: string = "DefaultAI";
  public readonly type: string = "DefaultAI";

  public readonly personality: Personality;

  private turnProcessingQueue: {(afterFinishedCallback: () => void): void}[] = [];
  private afterTurnHasProcessed: () => void;

  private readonly player: Player;
  private readonly game: Game;

  private readonly map: GalaxyMap;

  private readonly mapEvaluator: MapEvaluator;
  private readonly unitEvaluator: UnitEvaluator;

  private readonly grandStrategyAI: GrandStrategyAI;
  private readonly objectivesAI: ObjectivesAI;
  private readonly frontsAI: FrontsAI;
  private readonly diplomacyAI: DiplomacyAI;
  private readonly economicAI: EconomicAI;

  constructor(player: Player, game: Game, personality?: Personality)
  {
    this.personality = personality || makeRandomPersonality();

    this.player = player;
    this.game = game;

    this.map = game.galaxyMap;

    this.unitEvaluator = new UnitEvaluator();
    this.mapEvaluator = new MapEvaluator(this.map, this.player, this.unitEvaluator);

    this.grandStrategyAI = new GrandStrategyAI(this.personality, this.mapEvaluator, this.game);
    this.objectivesAI = new ObjectivesAI(this.mapEvaluator, this.grandStrategyAI);
    this.frontsAI = new FrontsAI(this.mapEvaluator, this.objectivesAI, this.personality, this.game);

    this.diplomacyAI = new DiplomacyAI(this.mapEvaluator, this.game);
  }

  public processTurn(afterFinishedCallback: () => void)
  {
    this.afterTurnHasProcessed = afterFinishedCallback;

    this.turnProcessingQueue = this.constructTurnProcessingQueue();
    this.processTurnStep();
  }
  // TODO 20.02.2017 | handle variable amount of rows
  public createBattleFormation(
    availableUnits: Unit[],
    hasScouted: boolean,
    enemyUnits?: Unit[],
    enemyFormation?: Unit[][],
  ): Unit[][]
  {
    const scoutedUnits = hasScouted ? enemyUnits : null;
    const scoutedFormation = hasScouted ? enemyFormation : null;

    const formation = getNullFormation();
    const unitsToPlace = availableUnits.filter(unit => unit.canActThisTurn());

    const maxUnitsPerRow = formation[0].length;
    const maxUnitsPerSide = app.moduleData.ruleSet.battle.maxUnitsPerSide;

    let placedInFront = 0;
    let placedInBack = 0;
    let totalPlaced = 0;
    const unitsPlacedByArchetype: ArchetypeValues = {};

    const getUnitScoreFN = (unit: Unit, row: string) =>
    {
      const baseScore = this.unitEvaluator.evaluateCombatStrength(unit);

      const archetype = unit.template.archetype;
      const idealMaxUnitsOfArchetype = Math.ceil(maxUnitsPerSide / archetype.idealWeightInBattle);
      const unitsPlacedOfArchetype = unitsPlacedByArchetype[archetype.type] || 0;
      const overMaxOfArchetypeIdeal = Math.max(0, unitsPlacedOfArchetype - idealMaxUnitsOfArchetype);
      const archetypeIdealAdjust = 1 - overMaxOfArchetypeIdeal * 0.15;

      const rowUnits = row === "ROW_FRONT" ? formation[1] : formation[0];
      const rowModifier = archetype.scoreMultiplierForRowFN ?
        archetype.scoreMultiplierForRowFN(row, rowUnits, scoutedUnits, scoutedFormation) :
        archetype.rowScores[row];

      return(
      {
        unit: unit,
        score: baseScore * archetypeIdealAdjust * rowModifier,
        row: row,
      });
    };

    while (unitsToPlace.length > 0 && totalPlaced < maxUnitsPerSide)
    {
      const positionScores:
      {
        unit: Unit;
        score: number;
        row: string; // "ROW_FRONT" or "ROW_BACK" // TODO enum
      }[] = [];

      for (let i = 0; i < unitsToPlace.length; i++)
      {
        const unit = unitsToPlace[i];

        if (placedInFront < maxUnitsPerRow)
        {
          positionScores.push(getUnitScoreFN(unit, "ROW_FRONT"));
        }
        if (placedInBack < maxUnitsPerRow)
        {
          positionScores.push(getUnitScoreFN(unit, "ROW_BACK"));
        }
      }

      positionScores.sort((a, b) =>
      {
        return (b.score - a.score);
      });
      const topScore = positionScores[0];


      if (topScore.row === "ROW_FRONT")
      {
        placedInFront++;
        formation[1][placedInFront - 1] = topScore.unit;
      }
      else
      {
        placedInBack++;
        formation[0][placedInBack - 1] = topScore.unit;
      }

      totalPlaced++;
      if (!unitsPlacedByArchetype[topScore.unit.template.archetype.type])
      {
        unitsPlacedByArchetype[topScore.unit.template.archetype.type] = 0;
      }
      unitsPlacedByArchetype[topScore.unit.template.archetype.type]++;
      unitsToPlace.splice(unitsToPlace.indexOf(topScore.unit), 1);
    }

    return formation;
  }
  public respondToTradeOffer(
    receivedOffer: Trade,
    ownTrade: Trade,
  ): TradeResponse
  {
    return this.economicAI.respondToTradeOffer(receivedOffer, ownTrade);
  }
  public serialize(): DefaultAISaveData
  {
    // TODO
    return undefined;
  }

  private constructTurnProcessingQueue(): {(afterFinishedCallback: () => void): void}[]
  {
    const queue: {(afterFinishedCallback: () => void): void}[] = [];


    queue.push(triggerFinish =>
    {
      // evaluate grand strategy
      this.grandStrategyAI.setDesires();

      // set attitude
      this.diplomacyAI.setAttitudes();

      // process diplo objectives
      this.objectivesAI.processDiplomaticObjectives(triggerFinish);
    });


    queue.push(triggerFinish =>
    {
      // create front objectives
      this.objectivesAI.createFrontObjectives();

      // form fronts
      this.frontsAI.formFronts();

      // assign units
      this.frontsAI.assignUnits();

      // process economic objectives
      this.objectivesAI.processEconomicObjectives(triggerFinish);
    });

    queue.push(triggerFinish =>
    {
      // organize fleets
      this.frontsAI.organizeFleets();

      // execute front objectives
      this.objectivesAI.executeFrontObjectives(triggerFinish);
    });

    queue.push(triggerFinish =>
    {
      // organize fleets
      this.frontsAI.organizeFleets();
      triggerFinish();

      // // evaluate grand strategy
      // this.grandStrategyAI.setDesires();

      // // set attitude
      // this.diplomacyAI.setAttitudes();

      // // diplo
      // // TODO 03.04.2017 | should do separate things to pre-turn diplo
      // // don't want to declare war here for example
      // this.objectivesAI.processDiplomaticObjectives(triggerFinish);
    });

    // queue.push(triggerFinish =>
    // {
    //   // econ
    //   // same here. no point building stuff that can't be used yet
    //   this.objectivesAI.processEconomicObjectives(triggerFinish);
    // });


    return queue;
  }
  private processTurnStep(): void
  {
    const nextStep = this.turnProcessingQueue.shift();

    if (!nextStep)
    {
      const afterFinishedCallback = this.afterTurnHasProcessed;
      this.afterTurnHasProcessed = null;

      afterFinishedCallback();

      return;
    }

    nextStep(this.processTurnStep.bind(this));
  }
}
