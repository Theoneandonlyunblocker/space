
import {Battle} from "../battle/Battle";
import {BattleData} from "../battle/BattleData";
import {BattlePrepFormation} from "./BattlePrepFormation";
import
{
  FormationValidityModifier,
  FormationValidityModifierSourceType,
} from "./BattlePrepFormationValidity";
import {Player} from "../player/Player";
import {Unit} from "../unit/Unit";
import { CombatManager } from "../combat/CombatManager";
import { activeModuleData } from "../app/activeModuleData";
import { UnitBattleSide } from "../unit/UnitBattleSide";


// tslint:disable-next-line: no-any
export class BattlePrep<CombatPhase extends string = any>
{
  public battleData: BattleData;
  public combatManager: CombatManager<CombatPhase>;

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

  public get side1Formation(): BattlePrepFormation
  {
    return this.humanFormation || this.attackerFormation;
  }
  public get side2Formation(): BattlePrepFormation
  {
    return this.enemyFormation || this.defenderFormation;
  }

  public afterBattleFinishCallbacks: (() => void)[] = [];

  constructor(battleData: BattleData)
  {
    this.attacker = battleData.attacker.player;
    this.defender = battleData.defender.player;
    this.battleData = battleData;
    this.attackerUnits = battleData.attacker.units;
    this.defenderUnits = battleData.defender.units;

    this.getAllUnits().forEach(unit => unit.resetBattleStats());
    this.combatManager = new CombatManager(activeModuleData.combatPhases);

    const attackerHasScouted = this.attacker.starIsDetected(battleData.location);
    this.attackerFormation = new BattlePrepFormation(
    {
      player: this.attacker,
      units: this.attackerUnits,
      hasScouted: attackerHasScouted,
      isAttacker: true,
      validityModifiers: this.getAttackerFormationValidityModifiers(),
      triggerUnitBattlePrepEffect: (strength, effect, unit) =>
      {
        effect(strength, unit, this, this.attackerFormation, this.defenderFormation);
      },
    });

    const defenderHasScouted = this.defender.starIsDetected(battleData.location);

    this.defenderFormation = new BattlePrepFormation(
    {
      player: this.defender,
      units: this.defenderUnits,
      hasScouted: defenderHasScouted,
      isAttacker: false,
      validityModifiers: this.getDefenderFormationValidityModifiers(),
      triggerUnitBattlePrepEffect: (strength, effect, unit) =>
      {
        effect(strength, unit, this, this.defenderFormation, this.attackerFormation);
      },
    });

    this.triggerBattlePrepStartEffects();
    this.setHumanAndEnemy();

    if (this.enemyFormation)
    {
      this.enemyFormation.setAutoFormation(this.humanUnits);
    }
    else
    {
      this.attackerFormation.setAutoFormation(this.defenderUnits);
      this.defenderFormation.setAutoFormation(this.attackerUnits, this.attackerFormation.formation);
    }
  }

  public getAllUnits(): Unit[]
  {
    return [...this.attackerUnits, ...this.defenderUnits];
  }
  public makeBattle(): Battle
  {
    const battle = new Battle(
    {
      battleData: this.battleData,
      side1: this.side1Formation.formation,
      side2: this.side2Formation.formation.reverse(),
      side1Player: this.side1Formation.player,
      side2Player: this.side2Formation.player,
    });

    battle.afterFinishCallbacks = battle.afterFinishCallbacks.concat(this.afterBattleFinishCallbacks);

    battle.init();

    return battle;
  }
  public getBattleSideForPlayer(player: Player): UnitBattleSide
  {
    if (player === this.side1Formation.player)
    {
      return "side1";
    }
    else if (player === this.side2Formation.player)
    {
      return "side2";
    }
    else
    {
      throw new Error(`Player '${player.name.toString()}' is not part of battle.`);
    }
  }

  private setHumanAndEnemy(): void
  {
    if (!this.attacker.isAi)
    {
      this.humanPlayer = this.attacker;
      this.enemyPlayer = this.defender;
      this.humanUnits = this.attackerUnits;
      this.enemyUnits = this.defenderUnits;
      this.humanFormation = this.attackerFormation;
      this.enemyFormation = this.defenderFormation;
    }
    else if (!this.defender.isAi)
    {
      this.humanPlayer = this.defender;
      this.enemyPlayer = this.attacker;
      this.humanUnits = this.defenderUnits;
      this.enemyUnits = this.attackerUnits;
      this.humanFormation = this.defenderFormation;
      this.enemyFormation = this.attackerFormation;
    }
  }
  private getFormationForPlayer(player: Player): BattlePrepFormation
  {
    if (player === this.attacker)
    {
      return this.attackerFormation;
    }
    else if (player === this.defender)
    {
      return this.defenderFormation;
    }
    else
    {
      throw new Error(`Player '${player.name.toString()}' is not part of battle.`);
    }
  }
  private getOtherPlayerTo(player: Player): Player
  {
    if (player === this.attacker)
    {
      return this.defender;
    }
    else if (player === this.defender)
    {
      return this.attacker;
    }
    else
    {
      throw new Error(`Player '${player.name.toString()}' is not part of battle.`);
    }
  }

  private getAttackerFormationValidityModifiers(): FormationValidityModifier[]
  {
    const allModifiers: FormationValidityModifier[] = [];

    allModifiers.push({
      sourceType: FormationValidityModifierSourceType.OffensiveBattle,
      effect: {minUnits: 1},
    });

    return allModifiers;
  }
  private getDefenderFormationValidityModifiers(): FormationValidityModifier[]
  {
    const allModifiers: FormationValidityModifier[] = [];

    if (this.attacker === this.battleData.location.owner)
    {
      allModifiers.push({
        sourceType: FormationValidityModifierSourceType.AttackedInEnemyTerritory,

        effect: {minUnits: 1},
      });
    }
    else if (this.defender !== this.battleData.location.owner)
    {
      allModifiers.push({
        sourceType: FormationValidityModifierSourceType.AttackedInNeutralTerritory,

        effect: {minUnits: 1},
      });
    }

    return allModifiers;
  }
  private triggerBattlePrepStartEffects(): void
  {
    this.defenderFormation.triggerBattlePrepStartEffects();
    this.attackerFormation.triggerBattlePrepStartEffects();

    this.triggerBuildingBattlePrepStartEffects();
  }
  private triggerBuildingBattlePrepStartEffects(): void
  {
    const building = this.battleData.building;
    if (!building)
    {
      return;
    }

    const ownFormation = this.getFormationForPlayer(building.controller);
    const enemyFormation = this.getFormationForPlayer(this.getOtherPlayerTo(building.controller));

    const effects = building.modifiers.getBattlePrepEffects().resolve();
    effects.forEach((strength, effect) =>
    {
      effect.onBattlePrepStart(strength, building, this, ownFormation, enemyFormation);
    });
  }
}
