
import Battle from "./Battle";
import BattleData from "./BattleData";
import {BattlePrepFormation} from "./BattlePrepFormation";
import Player from "./Player";
import Unit from "./Unit";


export default class BattlePrep
{
  public battleData: BattleData;

  public attacker: Player;
  public defender: Player;
  public attackerFormation: BattlePrepFormation;
  public defenderFormation: BattlePrepFormation;
  public attackerUnits: Unit[];
  public defenderUnits: Unit[];

  public humanPlayer: Player;
  public enemyPlayer: Player;
  public humanFormation: BattlePrepFormation;
  public enemyFormation: BattlePrepFormation;
  public humanUnits: Unit[];
  public enemyUnits: Unit[];

  public afterBattleFinishCallbacks: (() => void)[] = [];


  constructor(battleData: BattleData)
  {
    this.attacker = battleData.attacker.player;
    this.defender = battleData.defender.player;
    this.battleData = battleData;
    this.attackerUnits = battleData.attacker.units;
    this.defenderUnits = battleData.defender.units;

    const attackerHasScouted = this.attacker.starIsDetected(battleData.location);
    this.attackerFormation = new BattlePrepFormation(
    {
      player: this.attacker,
      units: this.attackerUnits,
      hasScouted: attackerHasScouted,
      isAttacker: true,
      validityModifiers: this.getAttackerFormationValidityModifiers(),
      triggerBattlePrepEffect: (effect, unit) =>
      {
        effect(unit, this, this.attackerFormation, this.defenderFormation);
      },
    });

    const defenderHasScouted = this.defender.starIsDetected(battleData.location);

    this.defenderFormation = new BattlePrepFormation(
    {
      player: this.defender,
      units: this.defenderUnits,
      hasScouted: defenderHasScouted,
      isAttacker: false,
      triggerBattlePrepEffect: (effect, unit) =>
      {
        effect(unit, this, this.defenderFormation, this.attackerFormation);
      },
    });

    this.resetBattleStats();

    this.minDefenders = this.getInitialMinDefenders();

    this.setHumanAndEnemy();

    if (this.enemyFormation)
    {
      this.enemyFormation.setAutoFormation(this.humanUnits);

      this.defenderFormation.minUnits = this.minDefenders;
    }
    else
    {
      this.attackerFormation.setAutoFormation(this.defenderUnits);

      this.defenderFormation.minUnits = this.minDefenders;

      this.defenderFormation.setAutoFormation(this.attackerUnits, this.attackerFormation.formation);
    }
  }

  public forEachUnit(f: (u: Unit) => void): void
  {
    this.attackerUnits.forEach(f);
    this.defenderUnits.forEach(f);
  }
  public makeBattle(): Battle
  {
    const side1Formation = this.humanFormation || this.attackerFormation;
    const side2Formation = this.enemyFormation || this.defenderFormation;

    const side1Player = this.humanPlayer || this.attacker;
    const side2Player = this.enemyPlayer || this.defender;

    const battle = new Battle(
    {
      battleData: this.battleData,
      side1: side1Formation.formation,
      side2: side2Formation.formation.reverse(),
      side1Player: side1Player,
      side2Player: side2Player,
    });

    battle.afterFinishCallbacks = battle.afterFinishCallbacks.concat(this.afterBattleFinishCallbacks);

    battle.init();

    return battle;
  }

  private setHumanAndEnemy(): void
  {
    if (!this.attacker.isAI)
    {
      this.humanPlayer = this.attacker;
      this.enemyPlayer = this.defender;
      this.humanUnits = this.attackerUnits;
      this.enemyUnits = this.defenderUnits;
      this.humanFormation = this.attackerFormation;
      this.enemyFormation = this.defenderFormation;
    }
    else if (!this.defender.isAI)
    {
      this.humanPlayer = this.defender;
      this.enemyPlayer = this.attacker;
      this.humanUnits = this.defenderUnits;
      this.enemyUnits = this.attackerUnits;
      this.humanFormation = this.defenderFormation;
      this.enemyFormation = this.attackerFormation;
    }
  }
  private resetBattleStats(): void
  {
    this.forEachUnit(unit =>
    {
      unit.resetBattleStats();
    });
  }
  {
    });
  }
  private getInitialMinDefenders(): number
  {
    const isBeingFoughtOverTerritory = Boolean(this.battleData.building);

    if (isBeingFoughtOverTerritory)
    {
      return 0;
    }
    else
    {
      return 1;
    }
  }
}
