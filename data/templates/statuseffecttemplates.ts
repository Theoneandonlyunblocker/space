module Rance
{
  export module Templates
  {
    export interface IStatusEffectAttributeAdjustment
    {
      flat?: number;
      multiplier?: number;
    }
    export interface IStatusEffectAttributes
    {
      attack?: IStatusEffectAttributeAdjustment;
      defence?: IStatusEffectAttributeAdjustment;
      intelligence?: IStatusEffectAttributeAdjustment;
      speed?: IStatusEffectAttributeAdjustment;
    }
    export interface IStatusEffectTemplate
    {
      type: string;
      displayName: string;

      attributes?: IStatusEffectAttributes;
      passiveSkills?: IPassiveSkillTemplate[];
    }
    export module StatusEffects
    {
      export var test: IStatusEffectTemplate =
      {
        type: "test",
        displayName: "test",
        attributes:
        {
          attack:
          {
            flat: 9
          },
          defence:
          {
            flat: 9
          },
          intelligence:
          {
            flat: -9
          },
          speed:
          {
            flat: 9
          }
        },
        passiveSkills: [PassiveSkills.poisoned]
      }
    }
  }
}
