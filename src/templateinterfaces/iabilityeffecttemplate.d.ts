declare namespace Rance
{
  namespace Templates
  {
    interface IAbilityEffectTemplate
    {
      action: IEffectActionTemplate;
      // TODO | pass battle parameter?
      trigger?: (user: Unit, target: Unit) => boolean;
      data?: any;
      // called after parent effect with same user and effect target
      // nesting these wont work and wouldnt do anything anyway
      attachedEffects?: IAbilityEffectTemplate[];
      sfx?: IBattleSFXTemplate;
    }
  }
}
