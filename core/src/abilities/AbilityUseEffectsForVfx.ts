import {AbilityUseEffect} from "./AbilityUseEffect";


// all effects need to be triggered in order, as effects don't store atomic changes in display data, only snapshots of it
export class AbilityUseEffectsForVfx<EffectId extends string = any>
{
  public readonly individualEffects: {[K in EffectId]: AbilityUseEffect};
  public get squashed(): AbilityUseEffect
  {
    if (!this._squashed)
    {
      this._squashed = this.getSquashedEffect(...<EffectId[]>Object.keys(this.individualEffects));
    }

    return this._squashed;
  }
  public triggerAllEffects = this.triggerRemainingEffects;

  private readonly onTrigger: (effect: AbilityUseEffect) => void;
  private readonly unTriggeredEffectIds: EffectId[];
  private _squashed: AbilityUseEffect;

  constructor(effects: AbilityUseEffect[], onTrigger: (effect: AbilityUseEffect) => void)
  {
    this.onTrigger = onTrigger;
    this.unTriggeredEffectIds = effects.map(effect => (effect.effectId as EffectId));
    this.individualEffects = effects.reduce((effectsById, effect) =>
    {
      effectsById[effect.effectId] = effect;

      return effectsById;
    }, <{[K in EffectId]: AbilityUseEffect}>{});

  }

  public triggerEffectsUntil(effectToStopBefore: EffectId): void
  {
    const indexOfEffectToStopBefore = this.unTriggeredEffectIds.indexOf(effectToStopBefore);

    if (!effectToStopBefore)
    {
      // shouldn't happen with properly typed templates
      throw new Error(`Vfx tried to trigger ability use effect '${effectToStopBefore}', but no such effect was provided`);
    }
    else if (indexOfEffectToStopBefore === -1)
    {
      throw new Error(`Vfx tried to trigger ability use effect '${effectToStopBefore}', but that effect had already been triggered`)
    }

    const effectsToTrigger = this.unTriggeredEffectIds.slice(0, indexOfEffectToStopBefore);
    this.unTriggeredEffectIds.splice(0, indexOfEffectToStopBefore);

    this.triggerEffects(effectsToTrigger);
  }
  public triggerRemainingEffects(): void
  {
    this.triggerEffects(this.unTriggeredEffectIds);
  }

  private triggerEffects(effectIds: EffectId[]): void
  {
    const squashedEffect = this.getSquashedEffect(...effectIds);

    this.onTrigger(squashedEffect);
  }
  private getSquashedEffect(...effectIdsToSquash: EffectId[]): AbilityUseEffect
  {
    const effectsToSquash = effectIdsToSquash.map(effectId => this.individualEffects[effectId]);

    return AbilityUseEffectsForVfx.squashEffects(effectsToSquash);
  }

  private static squashEffects(
    effectsToSquash: AbilityUseEffect[],
  ): AbilityUseEffect
  {
    const allChangedUnitDisplayData = effectsToSquash.map(effect => effect.changedUnitDisplayData);
    const squashedChangedUnitDisplayData = allChangedUnitDisplayData.reduce((squashed, toSquash) =>
    {
      return {...squashed, ...toSquash};
    }, {});

    const freshestEffect = effectsToSquash[effectsToSquash.length - 1];
    const effectToUseAsBase = freshestEffect;

    const squashedEffect = <AbilityUseEffect>
    {
      ...effectToUseAsBase,
      changedUnitDisplayData: squashedChangedUnitDisplayData,
      effectId: `squashed | ${effectsToSquash.map(e => e.effectId).join(", ")}`,
    };

    return squashedEffect;
  }
}
