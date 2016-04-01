namespace Templates
{
  declare interface IStatusEffectTemplate
  {
    type: string;
    displayName: string;
    
    attributes?: IStatusEffectAttributes;
    passiveSkills?: IPassiveSkillTemplate[];
  }
}
