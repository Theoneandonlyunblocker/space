import {AbilityUseEffect} from "./battleAbilityUsage";
import BattleScene from "./BattleScene";

export default class AbilityUseEffectQueue
{
  public onCurrentFinished: () => void;
  public onAllFinished: () => void;
  public onEffectTrigger: (abilityUseEffect: AbilityUseEffect) => void;
  
  private queue: AbilityUseEffect[];
  private currentEffect: AbilityUseEffect;
  private battleScene: BattleScene;
  
  
  constructor()
  {
    this.triggerEffect = this.triggerEffect.bind(this);
    this.finishEffect = this.finishEffect.bind(this);
  }
  
  public addEffects(effects: AbilityUseEffect[])
  {
    this.queue.push(...effects);
  }
  public playOnce()
  {
    this.currentEffect = this.queue.shift();
    
    if (!this.currentEffect)
    {
      this.handleEndOfQueue();
      return;
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
  
  private triggerEffect()
  {
    if (this.onEffectTrigger)
    {
      this.onEffectTrigger(this.currentEffect)
    }
  }
  private finishEffect()
  {
    if (this.onCurrentFinished)
    {
      this.onCurrentFinished();
    }
    this.currentEffect = null;
  }
  private handleEndOfQueue()
  {
    if (this.onAllFinished)
    {
      this.onAllFinished();
    }
  }
}