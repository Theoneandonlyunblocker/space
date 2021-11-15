import { Unit } from "../unit/Unit";
import { CombatActionResults } from "./CombatActionResults";
import { applyCombatActionPrimitivesToResult, CombatActionPrimitivesWithValues, resolveCombatActionPrimitiveAdjustments } from "./CombatActionPrimitiveTemplate";
import { CombatActionModifier } from "./CombatActionModifier";
import { getOrderedResultModifiers, CombatActionResultModifierWithValue } from "./CombatActionResultModifier";
import { idGenerators } from "../app/idGenerators";


export class CombatAction
{
  public readonly id: number;

  public readonly mainAction: CombatActionModifier;
  public readonly source: Unit | undefined;
  public readonly target: Unit | undefined;
  public actionAttachedTo: CombatAction | undefined;

  public get modifiers(): CombatActionModifier[]
  {
    this.isDirty = true;

    return this._modifiers;
  }
  public get resultModifiers(): CombatActionResultModifierWithValue<any>[]
  {
    this.isDirty = true;

    return this._resultModifiers;
  }

  public get result(): CombatActionResults
  {
    if (this.isDirty)
    {
      this.cachedResult = this.getResult();
      this.isDirty = false;
    }

    return this.cachedResult;
  }

  private isDirty: boolean = true;
  private readonly _modifiers: CombatActionModifier[] = [];
  private readonly _resultModifiers: CombatActionResultModifierWithValue<any>[] = [];
  private readonly _flags: Set<string> = new Set();
  private cachedResult: CombatActionResults;

  constructor(props:
  {
    mainAction: CombatActionModifier;
    source: Unit | undefined;
    target: Unit | undefined;
    id?: number;
  })
  {
    this.mainAction = props.mainAction;
    this.source = props.source;
    this.target = props.target;
    this.id = props.id || idGenerators.combatAction++;
  }

  public isConnectedToAction(action: CombatAction): boolean
  {
    if (!this.actionAttachedTo)
    {
      return false;
    }
    else if (this.actionAttachedTo === action)
    {
      return true;
    }
    else
    {
      return this.actionAttachedTo.isConnectedToAction(action);
    }
  }
  public getFlags(): Set<string>
  {
    const allFlags = new Set<string>();

    this.mainAction.flags?.forEach(flag => allFlags.add(flag));
    this._flags.forEach(flag => allFlags.add(flag));

    return allFlags;
  }
  public setFlag(flag: string): void
  {
    this._flags.add(flag);
  }
  public clone(
    allClonedActionsById: {[id: number]: CombatAction},
    clonedUnitsById: {[id: number]: Unit},
  ): CombatAction
  {
    if (allClonedActionsById[this.id])
    {
      return allClonedActionsById[this.id];
    }

    const cloned = new CombatAction(
    {
      mainAction: this.mainAction,
      source: this.source ? clonedUnitsById[this.source.id] : undefined,
      target: this.target ? clonedUnitsById[this.target.id] : undefined,
      id: this.id,
    });

    allClonedActionsById[this.id] = cloned;

    cloned.modifiers.push(...this._modifiers);
    cloned.resultModifiers.push(...this._resultModifiers);

    if (this.actionAttachedTo)
    {
      if (allClonedActionsById[this.actionAttachedTo.id])
      {
        cloned.actionAttachedTo = allClonedActionsById[this.actionAttachedTo.id];
      }
      else
      {
        cloned.actionAttachedTo = this.actionAttachedTo.clone(allClonedActionsById, clonedUnitsById);
      }
    }

    return cloned;
  }

  private getPrimitiveValues(): CombatActionPrimitivesWithValues<number>
  {
    const allPrimitives = [this.mainAction, ...this.modifiers].map(modifier => modifier.primitives);

    return resolveCombatActionPrimitiveAdjustments(...allPrimitives);
  }
  private getResultWithoutResultModifiers(): CombatActionResults
  {
    const primitiveValues = this.getPrimitiveValues();

    const initialResult = new CombatActionResults();
    applyCombatActionPrimitivesToResult(initialResult, primitiveValues);

    return initialResult;
  }
  private getResult(): CombatActionResults
  {
    const result = this.getResultWithoutResultModifiers();

    const sortedResultModifiers = getOrderedResultModifiers(this.resultModifiers);
    sortedResultModifiers.forEach(modifierWithValue =>
    {
      const {modifier, value} = modifierWithValue;
      modifier.modifyResult(result, value);
    });

    return result;
  }
}
