import BattleScene from "./BattleScene";
import {AbilityUseEffect} from "./battleAbilityUsage";
import
{
  shallowExtend,
} from "./utility";


export class AbilityUseEffectQueue
{
  private onEffectStart: (effect: AbilityUseEffect) => void;
  private onSfxStart: () => void;
  private onCurrentFinished: () => void;
  private onAllFinished: () => void;
  private onEffectTrigger: (abilityUseEffect: AbilityUseEffect) => void;

  private queue: AbilityUseEffect[] = [];
  private currentEffect: AbilityUseEffect | null;
  private battleScene: BattleScene;


  constructor(battleScene: BattleScene, callbacks:
  {
    onEffectStart?: (effect: AbilityUseEffect) => void;
    onSfxStart?: () => void;
    onCurrentFinished?: () => void;
    onAllFinished?: () => void;
    onEffectTrigger?: (abilityUseEffect: AbilityUseEffect) => void;
  })
  {
    this.battleScene = battleScene;

    for (const key in callbacks)
    {
      this[key] = callbacks[key];
    }

    this.triggerEffect = this.triggerEffect.bind(this);
    this.finishEffect = this.finishEffect.bind(this);
  }

  private static squashEffects(
    parent: AbilityUseEffect,
    toSquash: AbilityUseEffect[],
    parentIsMostRecent: boolean = false,
  ): AbilityUseEffect
  {
    const squashedChangedUnitDisplayDataById = shallowExtend(
      {},
      parent.changedUnitDisplayDataById,
      ...toSquash.map(effect => effect.changedUnitDisplayDataById),
    );

    if (parentIsMostRecent)
    {
      const squashedEffect = shallowExtend(
        {},
        {changedUnitDisplayDataById: squashedChangedUnitDisplayDataById},
        parent,
      );

      return squashedEffect;
    }
    else
    {
      const squashedEffect = shallowExtend(
        {},
        parent,
        {changedUnitDisplayDataById: squashedChangedUnitDisplayDataById},
      );

      return squashedEffect;
    }
  }
  private static squashEffectsWithoutSfx(sourceEffects: AbilityUseEffect[]): AbilityUseEffect[]
  {
    const squashed: AbilityUseEffect[] = [];
    let effectsToSquash: AbilityUseEffect[] = [];
    for (let i = sourceEffects.length - 1; i >= 0; i--)
    {
      const effect = sourceEffects[i];
      if (effect.sfx)
      {
        if (effectsToSquash.length > 0)
        {
          const squashedEffect = AbilityUseEffectQueue.squashEffects(effect, effectsToSquash);
          effectsToSquash = [];

          squashed.push(squashedEffect);
        }
        else
        {
          squashed.push(effect);
        }
      }
      else
      {
        effectsToSquash.unshift(effect);
      }
    }

    if (effectsToSquash.length > 0)
    {
      const lastEffectWithSfx = squashed.pop()!;
      squashed.push(AbilityUseEffectQueue.squashEffects(lastEffectWithSfx, effectsToSquash, true));
    }

    squashed.reverse();

    return squashed;
  }

  public addEffects(effects: AbilityUseEffect[]): void
  {
    this.queue.push(...AbilityUseEffectQueue.squashEffectsWithoutSfx(effects));
  }
  public playOnce(): void
  {
    this.currentEffect = this.queue.shift() || null;

    if (!this.currentEffect)
    {
      this.handleEndOfQueue();

      return;
    }

    if (this.onEffectStart)
    {
      this.onEffectStart(this.currentEffect);
    }

    this.battleScene.handleAbilityUse(
    {
      sfxTemplate: this.currentEffect.sfx,
      user: this.currentEffect.sfxUser,
      target: this.currentEffect.sfxTarget,
      triggerEffectCallback: this.triggerEffect,
      onSfxStartCallback: this.onSfxStart,
      afterFinishedCallback: this.finishEffect,
    });
  }

  private triggerEffect(): void
  {
    if (this.onEffectTrigger)
    {
      this.onEffectTrigger(this.currentEffect!);
    }
  }
  private finishEffect(): void
  {
    this.currentEffect = null;
    if (this.onCurrentFinished)
    {
      this.onCurrentFinished();
    }
  }
  private handleEndOfQueue(): void
  {
    this.battleScene.updateUnits(() =>
    {
      if (this.onAllFinished)
      {
        this.onAllFinished();
      }
    });
  }
}
