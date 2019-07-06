import {activeModuleData} from "./activeModuleData";
import {ExecutedEffectsResult} from "./templateinterfaces/AbilityEffectAction";

import {BattleData} from "./BattleData";
import {BattleTurnOrder} from "./BattleTurnOrder";
import {Player} from "./Player";
import {Unit} from "./Unit";
import
{
  UnitBattleSide,
  unitBattleSides,
} from "./UnitBattleSide";
import {centerCameraOnPosition} from "./centerCameraOnPosition";
import {eventManager} from "./eventManager";
import
{
  clamp,
  randInt,
  reverseSide,
} from "./utility";


export class Battle
{
  public unitsById:
  {
    [id: number]: Unit;
  } = {};
  public unitsBySide:
  {
    side1: Unit[];
    side2: Unit[];
  } =
  {
    side1: [],
    side2: [],
  };
  public side1: Unit[][];
  public side1Player: Player;
  public side2: Unit[][];
  public side2Player: Player;

  public battleData: BattleData;

  public turnOrder: BattleTurnOrder;
  public activeUnit: Unit;

  public currentTurn: number;
  public maxTurns: number;
  public turnsLeft: number;

  public isVirtual: boolean = false; // true when a clone made by battle ai
  public isSimulated: boolean = false; // true when battle is between two ai players

  public get ended(): boolean
  {
    return this._ended;
  }
  public victor: Player;
  public loser: Player;
  public capturedUnits: Unit[];
  public deadUnits: Unit[];

  /**
   * 0.4 == 40% increased base evaluation for side1,
   * -0.1 == 10% increase for side2
   */
  public evaluationAdjustment: number = 0;

  public afterFinishCallbacks: (() => void)[] = [];

  private startHealth:
  {
    side1: number;
    side2: number;
  };

  private evaluation: // -1: side1 win, 0: even, 1: side2 win
  {
    [turnNumber: number]: number;
  } = {};
  private _ended: boolean = false;

  constructor(props:
  {
    battleData: BattleData;
    side1: Unit[][];
    side2: Unit[][];
    side1Player: Player;
    side2Player: Player;
  })
  {
    this.side1 = props.side1;
    this.side1Player = props.side1Player;
    this.side2 = props.side2;
    this.side2Player = props.side2Player;
    this.battleData = props.battleData;

    this.turnOrder = new BattleTurnOrder();
  }
  // Separate from constructor because cloned battles (for ai simulation) don't need to call this.
  public init(): void
  {
    unitBattleSides.forEach(sideId =>
    {
      const side = this[sideId];
      for (let i = 0; i < side.length; i++)
      {
        for (let j = 0; j < side[i].length; j++)
        {
          if (side[i][j])
          {
            this.unitsById[side[i][j].id] = side[i][j];
            this.unitsBySide[sideId].push(side[i][j]);

            const pos = Battle.getAbsolutePositionFromSidePosition([i, j], sideId);

            this.initUnit(side[i][j], sideId, pos);
          }
        }
      }
    });

    this.currentTurn = 0;
    this.maxTurns = 24;
    this.turnsLeft = this.maxTurns;
    this.updateTurnOrder();

    this.startHealth =
    {
      side1: this.getTotalCurrentHealthForSide("side1"),
      side2: this.getTotalCurrentHealthForSide("side2"),
    };

    if (this.shouldEnd())
    {
      this.endBattle();
    }
    else
    {
      this.shiftRowsIfNeeded();
    }

    this.triggerBattleStartAbilities();
  }
  public forEachUnit(callBack: (unit: Unit) => void): void
  {
    for (const id in this.unitsById)
    {
       callBack(this.unitsById[id]);
    }
  }
  public endTurn(): void
  {
    this.currentTurn++;
    this.turnsLeft--;
    this.updateTurnOrder();

    const shouldEnd = this.shouldEnd();
    if (shouldEnd)
    {
      this.endBattle();
    }
    else
    {
      this.shiftRowsIfNeeded();
    }
  }
  public getActivePlayer(): Player
  {
    if (!this.activeUnit)
    {
      return null;
    }

    const side = this.activeUnit.battleStats.side;

    return this.getPlayerForSide(side);
  }

  private initUnit(unit: Unit, side: UnitBattleSide, position: number[]): void
  {
    unit.resetBattleStats();
    unit.setBattlePosition(side, position);
    this.turnOrder.addUnit(unit);

    const isAttacking = this.battleData.attacker.units.indexOf(unit) !== -1;
    if (isAttacking)
    {
      unit.offensiveBattlesFoughtThisTurn += 1;
    }
  }
  private triggerBattleStartAbilities(): void
  {
    this.battleData.location.buildings.forEach(building =>
    {
      if (building.template.battleEffects)
      {
        building.template.battleEffects.filter(unitEffect =>
        {
          return unitEffect.atBattleStart;
        }).forEach(unitEffect =>
        {
          const executedEffectsResult: ExecutedEffectsResult = {};

          unitEffect.atBattleStart.forEach(abilityEffect =>
          {
            abilityEffect.executeAction(
              null,
              null,
              this,
              executedEffectsResult,
              null,
            );
          });
        });
      }
    });

    this.forEachUnit(unit =>
    {
      const passiveSkillsByPhase = unit.getPassiveSkillsByPhase();
      passiveSkillsByPhase.atBattleStart.forEach(passiveSkill =>
      {
        const executedEffectsResult: ExecutedEffectsResult = {};

        passiveSkill.atBattleStart.forEach(effect =>
        {
          effect.executeAction(
            unit,
            unit,
            this,
            executedEffectsResult,
            null,
          );
        });
      });
    });
  }
  private getPlayerForSide(side: UnitBattleSide): Player
  {
    if (side === "side1")
    {
      return this.side1Player;
    }
    else if (side === "side2")
    {
      return this.side2Player;
    }
    else
    {
      throw new Error("invalid side");
    }
  }
  public getSideForPlayer(player: Player): UnitBattleSide
  {
    if (this.side1Player === player)
    {
      return "side1";
    }
    else if (this.side2Player === player)
    {
      return "side2";
    }
    else
    {
      throw new Error("invalid player");
    }
  }
  private getOtherPlayer(player: Player): Player
  {
    if (player === this.side1Player)
    {
      return this.side2Player;
    }
    else if (player === this.side2Player)
    {
      return this.side1Player;
    }
    else
    {
      throw new Error("Invalid player");
    }
  }
  private getRowByPosition(position: number): (Unit | null)[]
  {
    const rowsPerSide = activeModuleData.ruleSet.battle.rowsPerFormation;
    const side: UnitBattleSide = position < rowsPerSide ? "side1" : "side2";
    const relativePosition = position % rowsPerSide;

    return this[side][relativePosition];
  }
  public getAllUnits(): Unit[]
  {
    const allUnits: Unit[] = [];

    this.forEachUnit(unit => allUnits.push(unit));

    return allUnits;
  }
  public getUnitsForSide(side: UnitBattleSide): Unit[]
  {
    return <Unit[]> this.unitsBySide[side].slice(0);
  }
  // Battle End
  public finishBattle(forcedVictor?: Player): void
  {
    this.victor = forcedVictor || this.getVictor();
    this.loser = this.getOtherPlayer(this.victor);

    for (let i = 0; i < this.deadUnits.length; i++)
    {
      this.deadUnits[i].removeFromPlayer();
    }

    const experienceGainedPerSide =
    {
      side1: this.getExperienceGainedForSide("side1"),
      side2: this.getExperienceGainedForSide("side2"),
    };

    this.forEachUnit(unit =>
    {
      unit.addExperience(experienceGainedPerSide[unit.battleStats.side]);
      unit.resetBattleStats();

      if (unit.currentHealth < Math.round(unit.maxHealth * 0.1))
      {
        unit.currentHealth = Math.round(unit.maxHealth * 0.1);
      }

      this.side1Player.identifyUnit(unit);
      this.side2Player.identifyUnit(unit);
    });

    if (this.victor)
    {
      this.capturedUnits.forEach(unit =>
      {
        activeModuleData.scripts.unit.onCapture.forEach(script =>
        {
          script(unit, this.loser, this.victor);
        });
      });
    }

    if (this.battleData.building)
    {
      if (this.victor)
      {
        this.battleData.building.setController(this.victor);
      }
    }

    if (this.isSimulated)
    {
      eventManager.dispatchEvent("renderLayer", "fleets", this.battleData.location);
    }
    else
    {
      centerCameraOnPosition(this.battleData.location);
      eventManager.dispatchEvent("selectFleets", []);
      eventManager.dispatchEvent("switchScene", "galaxyMap");
    }

    activeModuleData.scripts.battle.battleFinish.forEach(script =>
    {
      script(this);
    });

    for (let i = 0; i < this.afterFinishCallbacks.length; i++)
    {
      this.afterFinishCallbacks[i]();
    }
  }
  public getVictor(): Player
  {
    const evaluation = this.getEvaluation();

    if (evaluation > 0)
    {
      return this.side1Player;
    }
    else if (evaluation < 0)
    {
      return this.side2Player;
    }
    else
    {
      return this.battleData.defender.player;
    }
  }
  private getCapturedUnits(victor: Player, maxCapturedUnits: number): Unit[]
  {
    if (!victor || victor.isIndependent)
    {
      return [];
    }

    const winningSide = this.getSideForPlayer(victor);
    const losingSide = reverseSide(winningSide);

    const losingUnits = this.getUnitsForSide(losingSide);
    losingUnits.sort((a, b) =>
    {
      const captureChanceSort = b.battleStats.captureChance - a.battleStats.captureChance;
      if (captureChanceSort)
      {
        return captureChanceSort;
      }
      else
      {
        return randInt(0, 1) * 2 - 1; // -1 or 1
      }
    });

    const capturedUnits: Unit[] = [];

    for (let i = 0; i < losingUnits.length; i++)
    {
      if (capturedUnits.length >= maxCapturedUnits)
      {
        break;
      }

      const unit = losingUnits[i];
      if (unit.currentHealth <= 0 &&
        Math.random() <= unit.battleStats.captureChance)
      {
        capturedUnits.push(unit);
      }
    }

    return capturedUnits;
  }
  private getUnitDeathChance(unit: Unit, victor: Player): number
  {
    const player: Player = unit.fleet.player;

    let deathChance: number;

    if (player.isIndependent)
    {
      deathChance = activeModuleData.ruleSet.battle.independentUnitDeathChance;
    }
    else if (player.isAi)
    {
      deathChance = activeModuleData.ruleSet.battle.aiUnitDeathChance;
    }
    else
    {
      deathChance = activeModuleData.ruleSet.battle.humanUnitDeathChance;
    }

    const playerDidLose = (victor && player !== victor);
    if (playerDidLose)
    {
      deathChance += activeModuleData.ruleSet.battle.loserUnitExtraDeathChance;
    }

    return deathChance;
  }
  private getDeadUnits(capturedUnits: Unit[], victor: Player): Unit[]
  {
    const deadUnits: Unit[] = [];


    this.forEachUnit(unit =>
    {
      if (unit.currentHealth <= 0)
      {
        const wasCaptured = capturedUnits.indexOf(unit) >= 0;
        if (!wasCaptured)
        {
          const deathChance = this.getUnitDeathChance(unit, victor);
          if (Math.random() < deathChance)
          {
            deadUnits.push(unit);
          }
        }
      }
    });

    return deadUnits;
  }
  private getUnitValueForExperienceGainedCalculation(unit: Unit): number
  {
    return unit.level + 1;
  }
  private getSideValueForExperienceGainedCalculation(side: UnitBattleSide): number
  {
    return this.getUnitsForSide(side).map(unit =>
    {
      return this.getUnitValueForExperienceGainedCalculation(unit);
    }).reduce((total, value) =>
    {
      return total + value;
    }, 0);
  }
  private getExperienceGainedForSide(side: UnitBattleSide): number
  {
    const ownSideValue = this.getSideValueForExperienceGainedCalculation(side);
    const enemySideValue = this.getSideValueForExperienceGainedCalculation(reverseSide(side));

    return (enemySideValue / ownSideValue) * 10;
  }
  private shouldEnd(): boolean
  {
    if (!this.activeUnit)
    {
      return true;
    }

    if (this.turnsLeft <= 0)
    {
      return true;
    }

    const oneSideHasNoActiveUnits = unitBattleSides.some(side =>
    {
      return this.getUnitsForSide(side).every(unit => !unit.isActiveInBattle());
    });
    if (oneSideHasNoActiveUnits)
    {
      return true;
    }

    return false;
  }
  private endBattle(): void
  {
    this._ended = true;

    if (this.isVirtual)
    {
      return;
    }

    this.activeUnit = null;
    const victor = this.getVictor();

    // could add abilities that increase max captured units
    const maxCapturedUnits = activeModuleData.ruleSet.battle.baseMaxCapturedUnits;
    this.capturedUnits = this.getCapturedUnits(victor, maxCapturedUnits);
    this.deadUnits = this.getDeadUnits(this.capturedUnits, victor);
  }
  // End Battle End
  // Evaluation
  public getEvaluation(): number
  {
    let evaluation = 0;

    unitBattleSides.forEach(side =>
    {
      // positive * sign === good, negative * sign === bad
      const sign = side === "side1" ? 1 : -1; // positive = side1 advantage
      const currentHealth = this.getTotalCurrentHealthForSide(side);
      if (currentHealth <= 0)
      {
        evaluation -= 999 * sign;

        return;
      }
      // how much health remains from strating health 0.0 - 1.0
      const currentHealthFactor = currentHealth / this.startHealth[side];
      evaluation += currentHealthFactor * sign;

      const destroyedUnits = this.getUnitsForSide(side).filter(unit => !unit.isActiveInBattle());
      const destroyedUnitsCount = destroyedUnits.length;
      if (destroyedUnitsCount > 0)
      {
        evaluation *= Math.pow(destroyedUnits.length, 0.8);
      }

      if (this.evaluationAdjustment)
      {
        const sideWithAdvantageousAdjustment = this.evaluationAdjustment > 0 ?
          "side1" :
          "side2";
        if (side === sideWithAdvantageousAdjustment)
        {
          const evaluationMultiplier = 1 + Math.abs(this.evaluationAdjustment);

          evaluation *= evaluationMultiplier;
        }
      }
    });

    evaluation = clamp(evaluation, -1, 1);

    this.evaluation[this.currentTurn] = evaluation;

    return this.evaluation[this.currentTurn];
  }
  private getTotalCurrentHealthForRow(position: number): number
  {
    return this.getRowByPosition(position).map(unit =>
    {
      return unit ? unit.currentHealth : 0;
    }).reduce((total, value) =>
    {
      return total + value;
    }, 0);
  }
  private getTotalCurrentHealthForSide(side: UnitBattleSide): number
  {
    return this.getUnitsForSide(side).map(unit => unit.currentHealth).reduce((total, value) =>
    {
      return total + value;
    }, 0);
  }
  // End Evaluation
  private static getAbsolutePositionFromSidePosition(
    relativePosition: number[], side: UnitBattleSide): number[]
  {
    if (side === "side1")
    {
      return relativePosition;
    }
    else
    {
      const rowsPerSide = activeModuleData.ruleSet.battle.rowsPerFormation;

      return [relativePosition[0] + rowsPerSide, relativePosition[1]];
    }
  }
  private updateBattlePositions(side: UnitBattleSide): void
  {
    const units = this[side];
    for (let i = 0; i < units.length; i++)
    {
      const row = this[side][i];
      for (let j = 0; j < row.length; j++)
      {
        const pos = Battle.getAbsolutePositionFromSidePosition([i, j], side);
        const unit = row[j];

        if (unit)
        {
          unit.setBattlePosition(side, pos);
        }
      }
    }
  }
  private shiftRowsForSide(side: UnitBattleSide): void
  {
    let formation = this[side];
    if (side === "side1")
    {
      formation.reverse();
    }

    let nextHealthyRowIndex: number;

    // start at 1 because frontmost row shouldn't be healthy if this is called
    for (let i = 1; i < formation.length; i++)
    {
      const absoluteRow = side === "side1" ? i : i + activeModuleData.ruleSet.battle.rowsPerFormation;
      if (this.getTotalCurrentHealthForRow(absoluteRow) > 0)
      {
        nextHealthyRowIndex = i;
        break;
      }
    }

    if (!isFinite(nextHealthyRowIndex))
    {
      throw new Error("Tried to shift battle rows when all rows are defeated");
    }

    const rowsToShift = formation.splice(0, nextHealthyRowIndex);
    formation = formation.concat(rowsToShift);

    if (side === "side1")
    {
      formation.reverse();
    }

    this[side] = formation;

    this.updateBattlePositions(side);
  }
  private shiftRowsIfNeeded(): void
  {
    const rowsPerSide = activeModuleData.ruleSet.battle.rowsPerFormation;
    const side1FrontRowHealth = this.getTotalCurrentHealthForRow(rowsPerSide - 1);
    if (side1FrontRowHealth <= 0)
    {
      this.shiftRowsForSide("side1");
    }
    const side2FrontRowHealth = this.getTotalCurrentHealthForRow(rowsPerSide);
    if (side2FrontRowHealth <= 0)
    {
      this.shiftRowsForSide("side2");
    }
  }

  public makeVirtualClone(): Battle
  {
    const battleData = this.battleData;


    function cloneUnits(units: Unit[][]): Unit[][]
    {
      const clones: Unit[][] = [];
      for (let i = 0; i < units.length; i++)
      {
        const row: Unit[] = [];

        for (let j = 0; j < units[i].length; j++)
        {
          const unit = units[i][j];
          if (!unit)
          {
            row.push(unit);
          }
          else
          {
            row.push(unit.makeVirtualClone());
          }
        }
        clones.push(row);
      }

      return clones;
    }

    const side1 = cloneUnits(this.side1);
    const side2 = cloneUnits(this.side2);

    const side1Player = this.side1Player;
    const side2Player = this.side2Player;

    const clone = new Battle(
    {
      battleData: battleData,
      side1: side1,
      side2: side2,
      side1Player: side1Player,
      side2Player: side2Player,
    });

    [side1, side2].forEach(side =>
    {
      for (let i = 0; i < side.length; i++)
      {
        for (let j = 0; j < side[i].length; j++)
        {
          if (!side[i][j])
          {
            continue;
          }
          clone.turnOrder.addUnit(side[i][j]);
          clone.unitsById[side[i][j].id] = side[i][j];
          clone.unitsBySide[side[i][j].battleStats.side].push(side[i][j]);
        }
      }
    });

    clone.isVirtual = true;

    clone.currentTurn = this.currentTurn;
    clone.maxTurns = this.maxTurns;
    clone.turnsLeft = this.turnsLeft;
    clone.startHealth = this.startHealth;
    clone.updateTurnOrder();


    if (clone.shouldEnd())
    {
      clone.endBattle();
    }
    else
    {
      clone.shiftRowsIfNeeded();
    }

    return clone;
  }
  private updateTurnOrder(): void
  {
    this.turnOrder.update();
    this.activeUnit = this.turnOrder.getActiveUnit();
  }
}
