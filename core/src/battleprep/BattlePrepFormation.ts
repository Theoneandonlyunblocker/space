import
{
  FormationInvalidityReason,
  FormationValidity,
  FormationValidityModifier,
  FormationValidityModifierEffect,
  squashValidityModifierEffects,
  validityModifiersAreEqual,
} from "./BattlePrepFormationValidity";
import {Player} from "../player/Player";
import {Unit} from "../unit/Unit";
import {UnitDisplayData} from "../unit/UnitDisplayData";
import {getNullFormation} from "./getNullFormation";
import
{
  flatten2dArray,
} from "../generic/utility";
import { BaseBattlePrepUnitEffect, BattlePrepUnitEffect } from "./BattlePrepUnitEffect";
import { AdjustmentsMap } from "../generic/AdjustmentsMap";


export class BattlePrepFormation
{
  public readonly formation: Unit[][];
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

  private triggerUnitEffect: (strength: number, effect: BaseBattlePrepUnitEffect, unit: Unit) => void;

  constructor(props:
  {
    player: Player;
    units: Unit[];
    hasScouted: boolean;
    isAttacker: boolean;
    validityModifiers?: FormationValidityModifier[];
    triggerUnitEffect: (strength: number, effect: BaseBattlePrepUnitEffect, unit: Unit) => void;
  })
  {
    this.player = props.player;
    this.units = props.units;
    this.hasScouted = props.hasScouted;
    this.isAttacker = props.isAttacker;

    this.validityModifiers.push(...props.validityModifiers);
    this.triggerUnitEffect = props.triggerUnitEffect;

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

    const newFormation = this.player.aiController.createBattleFormation(
      this.getAvailableUnits(),
      this.hasScouted,
      enemyUnits,
      enemyFormation,
    );

    newFormation.forEach((row, i) =>
    {
      row.forEach((unitAtCell, j) =>
      {
        if (unitAtCell)
        {
          this.addNewUnit(unitAtCell, [i, j]);
        }
      });
    });
  }
  public hasUnit(unit: Unit): boolean
  {
    return Boolean(this.placedUnitPositionsById[unit.id]);
  }
  public clearFormation(): void
  {
    this.forEachUnitInFormation(unit => this.removeUnit(unit));
  }
  public getValidityRestriction(): Required<FormationValidityModifierEffect>
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
      reasons: FormationInvalidityReason.Valid,
      modifiers: this.validityModifiers,
    };

    const validityRestriction = this.getValidityRestriction();
    const amountOfUnitsPlaced = this.getPlacedUnits().length;

    if (amountOfUnitsPlaced < validityRestriction.minUnits)
    {
      validity.isValid = false;
      validity.reasons |= FormationInvalidityReason.NotEnoughUnits;
    }

    return validity;
    // tslint:enable:no-bitwise
  }
  public assignUnit(unit: Unit, position: number[]): void
  {
    const unitInTargetPosition = this.getUnitAtPosition(position);

    if (unitInTargetPosition)
    {
      if (unitInTargetPosition === unit)
      {
        // pass
      }
      else
      {
        this.swapUnits(unit, unitInTargetPosition);
      }
    }
    else
    {
      if (this.hasUnit(unit))
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
    if (!this.hasUnit(unit))
    {
      throw new Error("Tried to remove unit not part of the formation.");
    }

    this.handleRemoveUnit(unit);
    this.cleanUpUnitPosition(unit);

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
  public getUnitAtPosition(position: number[]): Unit
  {
    return this.formation[position[0]][position[1]];
  }

  private getUnitPosition(unit: Unit): number[]
  {
    return this.placedUnitPositionsById[unit.id];
  }
  private cleanUpUnitPosition(unit: Unit): void
  {
    if (!this.hasUnit(unit))
    {
      return;
    }

    const position = this.getUnitPosition(unit);

    this.formation[position[0]][position[1]] = null;
    delete this.placedUnitPositionsById[unit.id];
  }
  private setUnitPosition(unit: Unit, position: number[]): void
  {
    this.cleanUpUnitPosition(unit);

    this.formation[position[0]][position[1]] = unit;
    this.placedUnitPositionsById[unit.id] = position;

    this.displayDataIsDirty = true;
  }
  private addNewUnit(unit: Unit, position: number[]): void
  {
    this.setUnitPosition(unit, position);

    this.handleAddUnit(unit);

    this.displayDataIsDirty = true;
  }
  private swapUnits(unit1: Unit, unit2: Unit): void
  {
    if (unit1 === unit2)
    {
      throw new Error("Tried to swap unit position with itself.");
    }

    const new1Pos = this.getUnitPosition(unit2);
    const new2Pos = this.getUnitPosition(unit1);

    this.cleanUpUnitPosition(unit1);
    this.cleanUpUnitPosition(unit2);

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
  private handleAddUnit(unit: Unit): void
  {
    const unitEffects = this.getBattlePrepUnitEffectsForUnit(unit);
    const onAddEffectsWithStrengths = unitEffects.filter(effect =>
    {
      return Boolean(effect.whenPartOfFormation?.onAdd);
    }).map(fullEffect => fullEffect.whenPartOfFormation.onAdd).resolve();

    onAddEffectsWithStrengths.forEach((strength, effect) =>
    {
      this.triggerUnitEffect(
        strength,
        effect,
        unit,
      );

      this.displayDataIsDirty = true;
    });
  }
  private handleRemoveUnit(unit: Unit): void
  {
    const unitEffects = this.getBattlePrepUnitEffectsForUnit(unit);
    const onRemoveEffectsWithStrengths = unitEffects.filter(effect =>
    {
      return Boolean(effect.whenPartOfFormation?.onRemove);
    }).map(fullEffect => fullEffect.whenPartOfFormation.onRemove).resolve();

    onRemoveEffectsWithStrengths.forEach((strength, effect) =>
    {
      this.triggerUnitEffect(
        strength,
        effect,
        unit,
      );

      this.displayDataIsDirty = true;
    });
  }
  private getBattlePrepUnitEffectsForUnit(unit: Unit): AdjustmentsMap<BattlePrepUnitEffect>
  {
    const activeModifiers = unit.mapLevelModifiers.getAllActiveModifiers();
    const modifiersWithBattlePrepUnitEffect = activeModifiers.filter(modifier => modifier.template.selfBattlePrepEffects);

    const allEffectsWithAdjustments = modifiersWithBattlePrepUnitEffect.map(modifier =>
    {
      return modifier.template.selfBattlePrepEffects;
    });

    const effectsWithAdjustments = flatten2dArray(allEffectsWithAdjustments);

    const squashed = new AdjustmentsMap<BattlePrepUnitEffect>();

    effectsWithAdjustments.forEach(effectWithAdjustment =>
    {
      squashed.add(effectWithAdjustment.effect, effectWithAdjustment.adjustment);
    });

    return squashed;
  }
}
