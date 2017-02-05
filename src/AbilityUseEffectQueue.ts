import {AbilityUseEffect} from "./battleAbilityUsage";
import BattleScene from "./BattleScene";
import UnitDisplayData from "./UnitDisplayData";
import
{
  shallowExtend,
} from "./utility";

export class AbilityUseEffectQueue
{
  private onEffectStart: (effect: AbilityUseEffect) => void;
  private onSFXStart: () => void;
  private onCurrentFinished: () => void;
  private onAllFinished: () => void;
  private onEffectTrigger: (abilityUseEffect: AbilityUseEffect) => void;

  private queue: AbilityUseEffect[] = [];
  private currentEffect: AbilityUseEffect;
  private battleScene: BattleScene;


  constructor(battleScene: BattleScene, callbacks:
  {
    onEffectStart?: (effect: AbilityUseEffect) => void;
    onSFXStart?: () => void;
    onCurrentFinished?: () => void;
    onAllFinished?: () => void;
    onEffectTrigger?: (abilityUseEffect: AbilityUseEffect) => void;
  })
  {
    this.battleScene = battleScene;

    for (let key in callbacks)
    {
      this[key] = callbacks[key];
    }

    this.triggerEffect = this.triggerEffect.bind(this);
    this.finishEffect = this.finishEffect.bind(this);
  }

    private static squashEffects(
    parent: AbilityUseEffect, toSquash: AbilityUseEffect[], parentIsMostRecent: boolean = false): AbilityUseEffect
  {
    const squashedChangedUnitDisplayDataByID = shallowExtend<{[unitID: number]: UnitDisplayData}>(
      {},
      parent.changedUnitDisplayDataByID,
      ...toSquash.map(effect => effect.changedUnitDisplayDataByID),
    );

    if (parentIsMostRecent)
    {
      const squashedEffect = shallowExtend<AbilityUseEffect>(
        {},
        {changedUnitDisplayDataByID: squashedChangedUnitDisplayDataByID},
        parent,
      );

      return squashedEffect;
    }
    else
    {
      const squashedEffect = shallowExtend<AbilityUseEffect>(
        {},
        parent,
        {changedUnitDisplayDataByID: squashedChangedUnitDisplayDataByID},
      );

      return squashedEffect;
    }
  }
  private static squashEffectsWithoutSFX(sourceEffects: AbilityUseEffect[]): AbilityUseEffect[]
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
      const lastEffectWithSFX = squashed.pop();
      squashed.push(AbilityUseEffectQueue.squashEffects(lastEffectWithSFX, effectsToSquash, true));
    }

    squashed.reverse();

    return squashed;
  }

  public addEffects(effects: AbilityUseEffect[]): void
  {
    this.queue.push(...AbilityUseEffectQueue.squashEffectsWithoutSFX(effects));
  }
  public playOnce(): void
  {
    this.currentEffect = this.queue.shift();

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
      SFXTemplate: this.currentEffect.sfx,
      user: this.currentEffect.sfxUser,
      target: this.currentEffect.sfxTarget,
      triggerEffectCallback: this.triggerEffect,
      onSFXStartCallback: this.onSFXStart,
      afterFinishedCallback: this.finishEffect,
    });
  }

  private triggerEffect(): void
  {
    if (this.onEffectTrigger)
    {
      this.onEffectTrigger(this.currentEffect);
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
    if (this.onAllFinished)
    {
      this.onAllFinished();
    }
  }
}
