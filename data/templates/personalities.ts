module Rance
{
  export interface IArchetypeValues
  {
    [archetypeType: string]: number; // archetype: Templates.UnitTemplateArchetype
  }
  export interface IPersonality
  {
    expansiveness: number;
    aggressiveness: number;
    friendliness: number;

    unitCompositionPreference: IArchetypeValues;
  }
  export function makeRandomPersonality(): IPersonality
  {
    // {[prop]: value} is ES6 object initializer syntax that gets compiled to ES5 by typescript
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
    return(
    {
      expansiveness: Math.random(),
      aggressiveness: Math.random(),
      friendliness: Math.random(),

      unitCompositionPreference:
      {
        [Templates.UnitArchetypes.combat.type]: Math.random(),
        [Templates.UnitArchetypes.defence.type]: Math.random(),
        [Templates.UnitArchetypes.utility.type]: Math.random()
      }
    });
  }
  export module Templates
  {
    export module Personalities
    {
      export var testPersonality1: IPersonality =
      {
        expansiveness: 1,
        aggressiveness: 0.6,
        friendliness: 0.4,

        unitCompositionPreference:
        {
          [Templates.UnitArchetypes.combat.type]: 1,
          [Templates.UnitArchetypes.defence.type]: 0.8,
          [Templates.UnitArchetypes.utility.type]: 0.3
        }
      }
    }
  }
}