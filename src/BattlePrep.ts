
import Battle from "./Battle";
import BattleData from "./BattleData";
import BattlePrepFormation from "./BattlePrepFormation";
import Player from "./Player";
import Unit from "./Unit";

export default class BattlePrep
{
  public battleData: BattleData;
  public attacker: Player;
  public defender: Player;
  public humanPlayer: Player;
  public enemyPlayer: Player;
  public humanFormation: BattlePrepFormation;
  public enemyFormation: BattlePrepFormation;
  public humanUnits: Unit[];
  public enemyUnits: Unit[];
  public afterBattleFinishCallbacks: {(): void}[] = [];
  public minDefenders: number;

  private attackerUnits: Unit[];
  private defenderUnits: Unit[];

  private attackerFormation: BattlePrepFormation;
  private defenderFormation: BattlePrepFormation;


  constructor(battleData: BattleData)
  {
    this.attacker = battleData.attacker.player;
    this.defender = battleData.defender.player;
    this.battleData = battleData;
    this.attackerUnits = battleData.attacker.units;
    this.defenderUnits = battleData.defender.units;

    const attackerHasScouted = this.attacker.starIsDetected(battleData.location);
    this.attackerFormation = new BattlePrepFormation(
      this.attacker, this.attackerUnits, attackerHasScouted, 1, true);

    const defenderHasScouted = this.defender.starIsDetected(battleData.location);
    this.defenderFormation = new BattlePrepFormation(
      this.defender, this.defenderUnits, defenderHasScouted, undefined, false);

    this.resetBattleStats();

    this.minDefenders = this.getInitialMinDefenders();

    this.setHumanAndEnemy();
    if (this.enemyFormation)
    {
      this.enemyFormation.setAutoFormation(this.humanUnits);

      this.triggerPassiveSkills(this.enemyFormation);
      this.defenderFormation.minUnits = this.minDefenders;
    }
    else
    {
      this.attackerFormation.setAutoFormation(this.defenderUnits);

      this.triggerPassiveSkills(this.attackerFormation);
      this.defenderFormation.minUnits = this.minDefenders;

      this.defenderFormation.setAutoFormation(this.attackerUnits, this.attackerFormation.formation);
    }
  }

  public forEachUnit(f: (u: Unit) => void): void
  {
    this.attackerUnits.forEach(f);
    this.defenderUnits.forEach(f);
  }
  public isLocationNeutral(): boolean
  {
    return(
      this.battleData.location.owner !== this.attacker &&
      this.battleData.location.owner !== this.defender
    );
  }
  public makeBattle(): Battle
  {
    var side1Formation = this.humanFormation || this.attackerFormation;
    var side2Formation = this.enemyFormation || this.defenderFormation;

    var side1Player = this.humanPlayer || this.attacker;
    var side2Player = this.enemyPlayer || this.defender;

    var battle = new Battle(
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
  private triggerPassiveSkills(formation: BattlePrepFormation): void
  {
    formation.forEachUnitInFormation(unit =>
    {
      const passiveSkillsByPhase = unit.getPassiveSkillsByPhase();
      if (passiveSkillsByPhase.inBattlePrep)
      {
        for (let j = 0; j < passiveSkillsByPhase.inBattlePrep.length; j++)
        {
          const skill = passiveSkillsByPhase.inBattlePrep[j];
          for (let k = 0; k < skill.inBattlePrep.length; k++)
          {
            skill.inBattlePrep[k](unit, this);
          }
        }
      }
    });
  }
  private getInitialMinDefenders(): number
  {
    if (this.isLocationNeutral())
    {
      return 1;
    }
    else
    {
      return 0;
    }
  }
}
