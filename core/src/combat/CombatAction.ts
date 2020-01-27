import { Unit } from "../unit/Unit";
import { CombatActionResults } from "./CombatActionResults";
import { applyCombatActionPrimitivesToResult, CombatActionPrimitivesWithValues, resolveCombatActionPrimitiveAdjustments } from "./CombatActionPrimitive";
import { CombatActionModifier } from "./CombatActionModifier";
import { getOrderedResultModifiers, CombatActionResultModifierWithValue } from "./CombatActionResultModifier";


export class CombatAction
{
  public readonly mainAction: CombatActionModifier;
  public readonly source: Unit;
  public readonly target: Unit;
  public readonly actionAttachedTo: CombatAction | undefined;

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
  private cachedResult: CombatActionResults;

  constructor(props:
  {
    mainAction: CombatActionModifier;
    source: Unit;
    target: Unit;
    actionAttachedTo?: CombatAction;
  })
  {
    this.mainAction = props.mainAction;
    this.source = props.source;
    this.target = props.target;
    this.actionAttachedTo = props.actionAttachedTo;
  }

  private getPrimitiveValues(): CombatActionPrimitivesWithValues<number>
  {
    const allPrimitives = [this.mainAction, ...this.modifiers].map(modifier => modifier.primitives);

    return resolveCombatActionPrimitiveAdjustments(...allPrimitives);
  }
  private getInitialResult(): CombatActionResults
  {
    const primitiveValues = this.getPrimitiveValues();

    const initialResult = new CombatActionResults();
    applyCombatActionPrimitivesToResult(initialResult, primitiveValues);

    return initialResult;
  }
  private getResult(): CombatActionResults
  {
    const result = this.getInitialResult();

    const sortedResultModifiers = getOrderedResultModifiers(this.resultModifiers);
    sortedResultModifiers.forEach(modifierWithValue =>
    {
      const {modifier, value} = modifierWithValue;
      modifier.modifyResult(result, value);
    });

    return result;
  }
}
