module Rance
{
  export interface IArchetypeValues
  {
    [archetypeType: string]: number;
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

    var unitCompositionPreference: IArchetypeValues = {};

    for (var archetype in app.moduleData.Templates.UnitArchetypes)
    {
      unitCompositionPreference[archetype] = Math.random();
    }

    return(
    {
      expansiveness: Math.random(),
      aggressiveness: Math.random(),
      friendliness: Math.random(),

      unitCompositionPreference: unitCompositionPreference
    });
  }
}