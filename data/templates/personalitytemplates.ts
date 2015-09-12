module Rance
{
  export interface IArchetypeValues
  {
    [archetype: string]: number; // archetype: Templates.UnitTemplateArchetype
    [archetype: number]: number;
  }
  export interface IPersonalityData
  {
    expansiveness: number;
    aggressiveness: number;
    friendliness: number;

    unitCompositionPreference: IArchetypeValues;
  }
  export function makeRandomPersonality(): IPersonalityData
  {
    // {[prop]: value} is ES6 object initializer syntax that gets compiled to ES5 by typescript
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
    var unitCompositionPreference: IArchetypeValues =
    {
      [Templates.UnitTemplateArchetype.combat]: Math.random(),
      [Templates.UnitTemplateArchetype.defence]: Math.random(),
      [Templates.UnitTemplateArchetype.utility]: Math.random()
    }
    return(
    {
      expansiveness: Math.random(),
      aggressiveness: Math.random(),
      friendliness: Math.random(),

      unitCompositionPreference: unitCompositionPreference
    });
  }
  export module Templates
  {
    export module Personalities
    {
      export var testPersonality1: IPersonalityData =
      {
        expansiveness: 1,
        aggressiveness: 0.6,
        friendliness: 0.4,

        unitCompositionPreference:
        {
          [Templates.UnitTemplateArchetype.combat]: 1,
          [Templates.UnitTemplateArchetype.defence]: 0.8,
          [Templates.UnitTemplateArchetype.utility]: 0.3
        }
      }
    }
  }
}