import {AbilityUseEffect} from "./AbilityUseEffect";
import { ExecutedEffectsResult } from "./templateinterfaces/ExecutedEffectsResult";


export class AbilityUseEffectsForVfx<EffectId extends string = any, R extends ExecutedEffectsResult = any>
{
  public readonly individualEffects: {[K in EffectId]: AbilityUseEffect<Partial<R>>};
  public get squashed(): AbilityUseEffect<R>
  {
    if (!this._squashed)
    {
      this._squashed = this.getSquashedEffect(...<EffectId[]>Object.keys(this.individualEffects));
    }

    return this._squashed;
  }

  private readonly onTrigger: (effect: AbilityUseEffect) => void;
  private readonly hasTriggered: {[K in EffectId]: boolean};
  private _squashed: AbilityUseEffect<R>;

  constructor(effectsById: {[K in EffectId]: AbilityUseEffect<Partial<R>>}, onTrigger: (effect: AbilityUseEffect) => void)
  {
    this.individualEffects = effectsById;
    this.onTrigger = onTrigger;

    this.hasTriggered = Object.keys(effectsById).reduce((triggered: {[K in EffectId]: boolean}, effectId: string) =>
    {
      triggered[effectId] = false;

      return triggered;
    }, <{[K in EffectId]: boolean}>{});
  }

  public triggerEffect(...effectIds: EffectId[]): void
  {
    const alreadyTriggeredEffectIds = effectIds.filter(effectId => this.hasTriggered[effectId]);
    if (alreadyTriggeredEffectIds.length !== 0)
    {
      throw new Error(`Tried to trigger AbilityUseEffect(s) '${alreadyTriggeredEffectIds.join(", ")}' that had already been triggered.`);
    }

    const effectToTrigger = this.getSquashedEffect(...effectIds);

    this.onTrigger(effectToTrigger);
    effectIds.forEach(effectId => this.hasTriggered[effectId] = true);
  }
  public triggerAllEffects(): void
  {
    this.triggerEffect(...this.getUnTriggeredEffectIds());
  }
  public triggerAllEffectsBut(effectIdToExclude: EffectId, ...additionalEffectIdsToExclude: EffectId[]): void
  {
    const effectIdsToExclude = [effectIdToExclude, ...additionalEffectIdsToExclude];

    const unTriggeredEffectIdsNotInExclusion =
      this.getUnTriggeredEffectIds().filter(effectId => effectIdsToExclude.indexOf(effectId) === -1);

    this.triggerEffect(...unTriggeredEffectIdsNotInExclusion);
  }

  private getUnTriggeredEffectIds(): EffectId[]
  {
    return <EffectId[]>Object.keys(this.hasTriggered).filter(effectId => !this.hasTriggered[effectId]);
  }
  private getSquashedEffect(...effectIdsToSquash: EffectId[]): AbilityUseEffect<R>
  {
    const effectsToSquash = effectIdsToSquash.map(effectId => this.individualEffects[effectId]);

    return AbilityUseEffectsForVfx.squashEffects(effectsToSquash);
  }

  private static squashEffects<R extends ExecutedEffectsResult>(
    toSquash: AbilityUseEffect<Partial<R>>[],
  ): AbilityUseEffect<R>
  {
    const squashedChangedUnitDisplayData =
    {
      ...toSquash.map(effect => effect.changedUnitDisplayData),
    };
    const freshestEffect = toSquash[toSquash.length - 1];

    const squashedEffect = <AbilityUseEffect<R>>
    {
      changedUnitDisplayData: squashedChangedUnitDisplayData,
      ...freshestEffect,
      effectId: `squashed | ${toSquash.map(e => e.effectId).join(", ")}`,
    };

    return squashedEffect;
  }
}
