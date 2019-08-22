import {AbilityUseEffect, AbilityUseEffectsById} from "./AbilityUseEffect";


export class AbilityUseEffectsForVfx<E extends AbilityUseEffectsById = {}>
{
  public readonly individualEffects: E;
  public get squashed(): AbilityUseEffect
  {
    if (!this._squashed)
    {
      this._squashed = this.getSquashedEffect(...Object.keys(this.individualEffects));
    }

    return this._squashed;
  }

  private readonly onTrigger: (effect: AbilityUseEffect) => void;
  private readonly hasTriggered: {[K in keyof E]: boolean};
  private _squashed: AbilityUseEffect;

  constructor(effectsById: E, onTrigger: (effect: AbilityUseEffect) => void)
  {
    this.individualEffects = effectsById;
    this.onTrigger = onTrigger;

    this.hasTriggered = Object.keys(effectsById).reduce((triggered: {[K in keyof E]: boolean}, effectId: keyof E) =>
    {
      triggered[effectId] = false;

      return triggered;
    }, <{[K in keyof E]: boolean}>{});
  }

  public triggerEffect(...effectIds: (keyof E)[]): void
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
  public triggerAllEffectsBut(effectIdToExclude: keyof E, ...additionalEffectIdsToExclude: (keyof E)[]): void
  {
    const effectIdsToExclude = [effectIdToExclude, ...additionalEffectIdsToExclude];

    const unTriggeredEffectIdsNotInExclusion =
      this.getUnTriggeredEffectIds().filter(effectId => effectIdsToExclude.indexOf(effectId) === -1);

    this.triggerEffect(...unTriggeredEffectIdsNotInExclusion);
  }

  private getUnTriggeredEffectIds(): (keyof E)[]
  {
    return Object.keys(this.hasTriggered).filter(effectId => !this.hasTriggered[effectId]);
  }
  private getSquashedEffect(...effectIdsToSquash: (keyof E)[]): AbilityUseEffect
  {
    const effectsToSquash = effectIdsToSquash.map(effectId => this.individualEffects[effectId]);

    return AbilityUseEffectsForVfx.squashEffects(effectsToSquash);
  }

  private static squashEffects(
    toSquash: AbilityUseEffect[],
  ): AbilityUseEffect
  {
    const squashedChangedUnitDisplayData =
    {
      ...toSquash.map(effect => effect.changedUnitDisplayData),
    };
    const freshestEffect = toSquash[toSquash.length - 1];

    const squashedEffect: AbilityUseEffect =
    {
      changedUnitDisplayData: squashedChangedUnitDisplayData,
      ...freshestEffect,
      effectId: `squashed | ${toSquash.map(e => e.effectId).join(", ")}`,
    };

    return squashedEffect;
  }
}
