import {ArchetypeValues} from "../../../src/ArchetypeValues";
import {GalaxyMap} from "../../../src/GalaxyMap";
import {Game} from "../../../src/Game";
import {Personality} from "../../../src/Personality";
import {Player} from "../../../src/Player";
import {TradeOffer} from "../../../src/TradeOffer";
import {Unit} from "../../../src/Unit";
import {activeModuleData} from "../../../src/activeModuleData";
import {getNullFormation} from "../../../src/getNullFormation";
import {AiTemplate} from "../../../src/templateinterfaces/AiTemplate";
import
{
  makeRandomPersonality,
} from "../../../src/utility";

import {DefaultAiSaveData} from "./DefaultAiSaveData";
import {DiplomacyAi} from "./DiplomacyAi";
import {EconomicAi} from "./EconomicAi";
import {FrontsAi} from "./FrontsAi";
import {GrandStrategyAi} from "./GrandStrategyAi";
import {MapEvaluator} from "./MapEvaluator";
import {ObjectivesAi} from "./ObjectivesAi";
import {UnitEvaluator} from "./UnitEvaluator";


export class DefaultAi implements AiTemplate<DefaultAiSaveData>
{
  public static readonly type: string = "DefaultAi";
  public readonly type: string = "DefaultAi";

  public readonly personality: Personality;

  private turnProcessingQueue: ((afterFinishedCallback: () => void) => void)[] = [];
  private afterTurnHasProcessed: () => void;

  private readonly player: Player;
  private readonly game: Game;

  private readonly map: GalaxyMap;

  private readonly mapEvaluator: MapEvaluator;
  private readonly unitEvaluator: UnitEvaluator;

  private readonly grandStrategyAi: GrandStrategyAi;
  private readonly objectivesAi: ObjectivesAi;
  private readonly frontsAi: FrontsAi;
  private readonly diplomacyAi: DiplomacyAi;
  private readonly economicAi: EconomicAi;

  constructor(player: Player, game: Game, personality?: Personality)
  {
    this.personality = personality || makeRandomPersonality();

    this.player = player;
    this.game = game;

    this.map = game.galaxyMap;

    this.unitEvaluator = new UnitEvaluator();
    this.mapEvaluator = new MapEvaluator(this.map, this.player, this.unitEvaluator);

    this.grandStrategyAi = new GrandStrategyAi(this.personality, this.mapEvaluator, this.game);
    this.objectivesAi = new ObjectivesAi(this.mapEvaluator, this.grandStrategyAi);
    this.frontsAi = new FrontsAi(this.player, this.objectivesAi);

    this.diplomacyAi = new DiplomacyAi(this.mapEvaluator, this.game);
    this.economicAi = new EconomicAi();
  }

  public processTurn(afterFinishedCallback: () => void)
  {
    this.afterTurnHasProcessed = afterFinishedCallback;

    this.turnProcessingQueue = this.constructTurnProcessingQueue();
    this.processTurnStep();
  }
  // TODO 2017.02.20 | handle variable amount of rows
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
    const unitsToPlace = availableUnits.slice();

    const maxUnitsPerRow = formation[0].length;
    const maxUnitsPerSide = activeModuleData.ruleSet.battle.maxUnitsPerSide;

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
    receivedOffer: TradeOffer,
  ): TradeOffer
  {
    return this.economicAi.respondToTradeOffer(receivedOffer);
  }
  public serialize(): DefaultAiSaveData
  {
    // TODO
    return undefined;
  }

  private constructTurnProcessingQueue(): ((afterFinishedCallback: () => void) => void)[]
  {
    const queue: ((afterFinishedCallback: () => void) => void)[] = [];


    queue.push(triggerFinish =>
    {
      // evaluate grand strategy
      this.grandStrategyAi.setDesires();

      // set attitude
      this.diplomacyAi.setAttitudes();

      // process diplo objectives
      this.objectivesAi.processDiplomaticObjectives(triggerFinish);
    });


    queue.push(triggerFinish =>
    {
      // create front objectives
      this.objectivesAi.createFrontObjectives();

      // form fronts
      this.frontsAi.formFronts();

      // assign units
      this.frontsAi.assignUnits();

      // process economic objectives
      this.objectivesAi.processEconomicObjectives(triggerFinish);
    });

    queue.push(triggerFinish =>
    {
      // organize fleets
      this.frontsAi.organizeFleets();

      // execute front objectives
      this.objectivesAi.executeFrontObjectives(triggerFinish);
    });

    queue.push(triggerFinish =>
    {
      // organize fleets
      this.frontsAi.organizeFleets();
      triggerFinish();

      // // evaluate grand strategy
      // this.grandStrategyAi.setDesires();

      // // set attitude
      // this.diplomacyAi.setAttitudes();

      // // diplo
      // // TODO 2017.04.03 | should do separate things to pre-turn diplo
      // // don't want to declare war here for example
      // this.objectivesAi.processDiplomaticObjectives(triggerFinish);
    });

    // queue.push(triggerFinish =>
    // {
    //   // econ
    //   // same here. no point building stuff that can't be used yet
    //   this.objectivesAi.processEconomicObjectives(triggerFinish);
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
