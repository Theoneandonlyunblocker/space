import {AbilityUseEffect} from "./battleAbilityUsage";
import BattleScene from "./BattleScene";
import UnitDisplayData from "./UnitDisplayData";
import
{
  shallowExtend
} from "./utility";

export default class AbilityUseEffectQueue
{
  public onEffectStart: (effect: AbilityUseEffect) => void;
  public onCurrentFinished: () => void;
  public onAllFinished: () => void;
  public onEffectTrigger: (abilityUseEffect: AbilityUseEffect) => void;
  
  private queue: AbilityUseEffect[] = [];
  private currentEffect: AbilityUseEffect;
  private battleScene: BattleScene;
  
  
  constructor(battleScene: BattleScene)
  {
    this.battleScene = battleScene;
    
    this.triggerEffect = this.triggerEffect.bind(this);
    this.finishEffect = this.finishEffect.bind(this);
  }
  
  public addEffects(effects: AbilityUseEffect[])
  {
    this.queue.push(...AbilityUseEffectQueue.squashEffectsWithoutSFX(effects));
  }
  public playOnce()
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
      afterFinishedCallback: this.finishEffect
    });
  }
  
  private static squashEffectsWithoutSFX(sourceEffects: AbilityUseEffect[]): AbilityUseEffect[]
  {
    const squashed: AbilityUseEffect[] = [];
    let effectsToSquash: AbilityUseEffect[] = [];
    for (var i = sourceEffects.length - 1; i >= 0; i--)
    {
      const effect = sourceEffects[i];
      if (effect.sfx)
      {
        if (effectsToSquash.length > 0)
        {
          const squashedChangedUnitDisplayDataByID: {[unitID: number]: UnitDisplayData} =
          shallowExtend(
            {},
            effect.changedUnitDisplayDataByID,
            ...effectsToSquash.map(e => e.changedUnitDisplayDataByID)
          );

          const squashedEffect: AbilityUseEffect = shallowExtend(
            {},
            effect,
            {changedUnitDisplayDataByID: squashedChangedUnitDisplayDataByID}
          );
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
    
    return squashed;
  }
  private triggerEffect()
  {
    if (this.onEffectTrigger)
    {
      this.onEffectTrigger(this.currentEffect)
    }
  }
  private finishEffect()
  {
    this.currentEffect = null;
    if (this.onCurrentFinished)
    {
      this.onCurrentFinished();
    }
  }
  private handleEndOfQueue()
  {
    if (this.onAllFinished)
    {
      this.onAllFinished();
    }
  }
}