import DefaultAISaveData from "./DefaultAISaveData";
import DiplomacyAI from "./DiplomacyAI";
import EconomyAI from "./EconomyAI";
import FrontsAI from "./FrontsAI";
import {GrandStrategyAI} from "./GrandStrategyAI";
import MapEvaluator from "./MapEvaluator";
import {UnitEvaluator} from "./UnitEvaluator";
import {ObjectivesAI} from "./ObjectivesAI";

import AITemplate from "../../../src/templateinterfaces/AITemplate";

import app from "../../../src/App";
import ArchetypeValues from "../../../src/ArchetypeValues";
import GalaxyMap from "../../../src/GalaxyMap";
import Game from "../../../src/Game";
import getNullFormation from "../../../src/getNullFormation";
import Personality from "../../../src/Personality";
import Player from "../../../src/Player";
import Unit from "../../../src/Unit";
import
{
  makeRandomPersonality,
} from "../../../src/utility";

export default class DefaultAI implements AITemplate<DefaultAISaveData>
{
  static type: string = "DefaultAI";
  public type: string = "DefaultAI";

  player: Player;
  game: Game;

  personality: Personality;
  map: GalaxyMap;

  mapEvaluator: MapEvaluator;
  unitEvaluator: UnitEvaluator;

  grandStrategyAI: GrandStrategyAI;
  objectivesAI: ObjectivesAI;
  economyAI: EconomyAI;
  frontsAI: FrontsAI;
  diplomacyAI: DiplomacyAI;

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
    this.economyAI = new EconomyAI(
    {
      objectivesAI: this.objectivesAI,
      frontsAI: this.frontsAI,
      mapEvaluator: this.mapEvaluator,
      personality: this.personality,
    });
    this.diplomacyAI = new DiplomacyAI(this.mapEvaluator, this.objectivesAI,
      this.game, this.personality);
  }

  public processTurn(afterFinishedCallback: () => void)
  {
    // gsai evaluate grand strategy
    this.grandStrategyAI.setDesires();

    // dai set attitude
    this.diplomacyAI.setAttitudes();

    // oai make objectives
    this.objectivesAI.setAllDiplomaticObjectives();

    // dai resolve diplomatic objectives
    this.diplomacyAI.resolveDiplomaticObjectives(
      this.processTurnAfterDiplomaticObjectives.bind(this, afterFinishedCallback));
  }
  private processTurnAfterDiplomaticObjectives(afterFinishedCallback: () => void)
  {
    this.objectivesAI.setAllEconomicObjectives();
    this.economyAI.resolveEconomicObjectives();

    // oai make objectives
    this.objectivesAI.setAllMoveObjectives();

    // fai form fronts
    this.frontsAI.formFronts();

    // fai assign units
    this.frontsAI.assignUnits();

    // fai request units
    this.frontsAI.setUnitRequests();

    // eai fulfill requests
    this.economyAI.satisfyAllRequests();

    // fai organize fleets
    this.frontsAI.organizeFleets();

    // fai set fleets yet to move
    this.frontsAI.setFrontsToMove();

    // fai move fleets
    // function param is called after all fronts have moved
    this.frontsAI.moveFleets(this.finishMovingFleets.bind(this, afterFinishedCallback));
  }
  private finishMovingFleets(afterFinishedCallback: () => void)
  {
    this.frontsAI.organizeFleets();
    if (afterFinishedCallback)
    {
      afterFinishedCallback();
    }
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

      positionScores.sort(function(a, b)
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
  public serialize(): DefaultAISaveData
  {
    // TODO
    return undefined;
  }
}
