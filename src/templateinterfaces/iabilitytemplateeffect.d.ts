declare module Rance
{
  module Templates
  {
    interface IAbilityTemplateEffect
    {
      template: IEffectTemplate;
      trigger?: (user: Unit, target: Unit) => boolean;
      data?: any;
      // called after parent effect with same user and effect target
      // nesting these wont work and wouldnt do anything anyway
      attachedEffects?: IAbilityTemplateEffect[];
      sfx?: IBattleSFXTemplate;
    }
  }
}
