import { BaseBattlePrepEffect } from "./templateinterfaces/BattlePrepEffect";

import
{
  FormationValidity,
  FormationValidityModifier,
  FormationValidityReason,
  validityModifiersAreEqual,
  FormationValidityModifierEffect,
  squashValidityModifierEffects,
} from "./BattlePrepFormationValidity";
import Player from "./Player";
import Unit from "./Unit";
import UnitDisplayData from "./UnitDisplayData";
import getNullFormation from "./getNullFormation";
import
{
  flatten2dArray,
} from "./utility";


export class BattlePrepFormation
{
  public formation: Unit[][];
  public units: Unit[];
  public hasScouted: boolean;
  public placedUnitPositionsById:
  {
    [id: number]: number[];
  } = {};

  private player: Player;
  private isAttacker: boolean;

  private readonly validityModifiers: FormationValidityModifier[] = [];

  private cachedDisplayData: {[unitId: number]: UnitDisplayData};
  private displayDataIsDirty: boolean = true;

  private triggerBattlePrepEffect: (effect: BaseBattlePrepEffect, unit: Unit) => void;

  constructor(props:
  {
    player: Player,
    units: Unit[],
    hasScouted: boolean,
    isAttacker: boolean,
    validityModifiers?: FormationValidityModifier[],
    triggerBattlePrepEffect: (effect: BaseBattlePrepEffect, unit: Unit) => void,
  })
  {
    this.player = props.player;
    this.units = props.units;
    this.hasScouted = props.hasScouted;
    this.isAttacker = props.isAttacker;

    this.validityModifiers.push(...props.validityModifiers);
    this.triggerBattlePrepEffect = props.triggerBattlePrepEffect;

    this.formation = getNullFormation();
  }

  public getPlacedUnits(): Unit[]
  {
    return flatten2dArray(this.formation).filter(unit => Boolean(unit));
  }
  public forEachUnitInFormation(f: (unit: Unit, pos?: number[]) => void): void
  {
    for (let i = 0; i < this.formation.length; i++)
    {
      for (let j = 0; j < this.formation[i].length; j++)
      {
        const unit = this.formation[i][j];
        if (unit)
        {
          f(unit, [i, j]);
        }
      }
    }
  }
  public getDisplayData(): {[unitId: number]: UnitDisplayData}
  {
    if (this.displayDataIsDirty)
    {
      this.cachedDisplayData = this.getFormationDisplayData();
      this.displayDataIsDirty = false;
    }

    return this.cachedDisplayData;
  }
  public setAutoFormation(enemyUnits?: Unit[], enemyFormation?: Unit[][]): void
  {
    this.clearFormation();

    this.formation = this.player.AIController.createBattleFormation(
      this.getAvailableUnits(),
      this.hasScouted,
      enemyUnits,
      enemyFormation,
    );
    this.forEachUnitInFormation((unit, pos) =>
    {
      this.placedUnitPositionsById[unit.id] = pos;
    });

    this.displayDataIsDirty = true;
  }
  // human formation stuff
  public getUnitPosition(unit: Unit): number[]
  {
    return this.placedUnitPositionsById[unit.id];
  }
  public clearFormation(): void
  {
    this.placedUnitPositionsById = {};
    this.formation = getNullFormation();

    this.displayDataIsDirty = true;
  }
  // end human formation stuff
  public getValidityRestriction(): FormationValidityModifierEffect
  {
    const allEffects = this.validityModifiers.map(modifier => modifier.effect);

    return squashValidityModifierEffects(...allEffects);
  }
  public getFormationValidity(): FormationValidity
  {
    // tslint:disable:no-bitwise
    const validity =
    {
      isValid: true,
      reasons: FormationValidityReason.Valid,
      modifiers: this.validityModifiers,
    };

    const validityRestriction = this.getValidityRestriction();
    const amountOfUnitsPlaced = this.getPlacedUnits().length;

    if (amountOfUnitsPlaced < validityRestriction.minUnits)
    {
      validity.isValid = false;
      validity.reasons |= FormationValidityReason.NotEnoughUnits;
    }

    return validity;
    // tslint:enable:no-bitwise
  }
  public assignUnit(unit: Unit, position: number[]): void
  {
    const unitInTargetPosition = this.getUnitAtPosition(position);

    if (unitInTargetPosition)
    {
      this.swapUnits(unit, unitInTargetPosition);
    }
    else
    {
      const alreadyHasUnit = Boolean(this.getUnitPosition(unit));

      if (alreadyHasUnit)
      {
        this.setUnitPosition(unit, position);
      }
      else
      {
        this.addNewUnit(unit, position);
      }
    }
  }
  public removeUnit(unit: Unit): void
  {
    const position = this.getUnitPosition(unit);
    const isPartOfFormation = Boolean(position);
    if (!isPartOfFormation)
    {
      // TODO 2018.05.24 | does this happen?
      throw new Error();
    }

    this.formation[position[0]][position[1]] = null;
    delete this.placedUnitPositionsById[unit.id];

    this.triggerPassiveSkillsForUnit("onRemove", unit);

    this.displayDataIsDirty = true;

  }
  public getValidityModifierIndex(modifier: FormationValidityModifier): number
  {
    for (let i = 0; i < this.validityModifiers.length; i++)
    {
      if (validityModifiersAreEqual(modifier, this.validityModifiers[i]))
      {
        return i;
      }
    }

    return -1;
  }
  public addValidityModifier(modifier: FormationValidityModifier): void
  {
    this.validityModifiers.push(modifier);
  }
  public removeValidityModifier(modifier: FormationValidityModifier): void
  {
    const index = this.getValidityModifierIndex(modifier);

    if (index === -1)
    {
      throw new Error("");
    }
    else
    {
      this.validityModifiers.splice(index, 1);
    }
  }

  private getUnitAtPosition(position: number[]): Unit
  {
    return this.formation[position[0]][position[1]];
  }
  private setUnitPosition(unit: Unit, position: number[]): void
  {
    this.formation[position[0]][position[1]] = unit;
    this.placedUnitPositionsById[unit.id] = position;

    this.displayDataIsDirty = true;
  }
  private addNewUnit(unit: Unit, position: number[]): void
  {
    this.setUnitPosition(unit, position);

    this.triggerPassiveSkillsForUnit("onAdd", unit);

    this.displayDataIsDirty = true;
  }
  private swapUnits(unit1: Unit, unit2: Unit): void
  {
    if (unit1 === unit2)
    {
      // TODO 2018.05.24 | does this happen?
      throw new Error();
    }

    const new1Pos = this.getUnitPosition(unit2);
    const new2Pos = this.getUnitPosition(unit1);

    this.setUnitPosition(unit1, new1Pos);
    this.setUnitPosition(unit2, new2Pos);
  }
  private getFormationDisplayData()
  {
    const displayDataById: {[unitId: number]: UnitDisplayData} = {};

    this.forEachUnitInFormation(unit =>
    {
      displayDataById[unit.id] = unit.getDisplayData("battlePrep");
    });

    return displayDataById;
  }
  private getAvailableUnits(): Unit[]
  {
    return this.isAttacker ?
      this.units.filter(unit => unit.canFightOffensiveBattle()) :
      this.units.slice();
  }
  private triggerPassiveSkillsForUnit(stateChange: "onAdd" | "onRemove", unit: Unit): void
  {
    const skills = unit.getPassiveSkillsByPhase().inBattlePrep;
    let didTriggerASkill = false;

    skills.forEach(skill =>
    {
      skill.inBattlePrep.forEach(effectPair =>
      {
        const effectToTrigger = effectPair[stateChange];

        this.triggerBattlePrepEffect(effectToTrigger, unit);

        didTriggerASkill = true;
      });
    });

    if (didTriggerASkill)
    {
      this.displayDataIsDirty = true;
    }
  }
}
