/// <reference path="iabilitytemplate.d.ts" />
/// <reference path="ipassiveskilltemplate.d.ts" />
/// <reference path="ispritetemplate.d.ts" />
/// <reference path="itechnologyrequirement.d.ts" />
/// <reference path="iunitarchetype.d.ts" />
/// <reference path="iunitdrawingfunction.d.ts" />
/// <reference path="iunitfamily.d.ts" />
/// <reference path="iweightedprobability.d.ts" />

declare module Rance
{
  module Templates
  {
    interface IUnitTemplate
    {
      type: string;
      displayName: string;
      description: string;
      sprite: ISpriteTemplate;
      isSquadron: boolean;
      buildCost: number;
      icon: string;
      maxHealth: number;
      maxMovePoints: number;
      
      // archetype is used by the ai to balance unit composition
      archetype: IUnitArchetype;
      // family is used to group ships for local specialties and AI favorites
      // f.ex. sector specializes in producing units with beam weapons
      families : IUnitFamily[];
      
      // how many stars away unit can see
      // -1: no vision, 0: current star only, 1: current & 1 away etc.
      visionRange: number;
      // like vision but for stealthy ships
      detectionRange: number;
      isStealthy?: boolean;
      
      attributeLevels:
      {
        attack: number;
        defence: number;
        intelligence: number;
        speed: number;
      };

      possibleAbilities: IWeightedProbability<IAbilityTemplate>[];
      possiblePassiveSkills?: IWeightedProbability<IPassiveSkillTemplate>[];
      specialAbilityUpgrades?: IAbilityBase[];
      // only one of the abilities in a nested array can be learned f.ex.
      // [canAlwaysLearn, canAlwaysLearn, [#1cantLearnIfHas#2, #2cantLearnIfHas#1]]
      learnableAbilities?: Array<IAbilityBase | IAbilityBase[]>;

      technologyRequirement?: ITechnologyRequirement;

      unitDrawingFN: IUnitDrawingFunction;
    }
  }
}
