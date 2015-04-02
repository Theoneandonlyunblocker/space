module Rance
{
  export interface IPersonalityData
  {
    expansiveness: number;
    aggressiveness: number;
    friendliness: number;

    unitCompositionPreference:
    {
      [archetype: string]: number;
    };
  }
  export function makeRandomPersonality(): IPersonalityData
  {
    var unitCompositionPreference:
    {
      [archetype: string]: number;
    } =
    {
      combat: Math.random(),
      defence: Math.random(),
      utility: Math.random()
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
          combat: 1,
          defence: 0.8,
          //magic: 0.3,
          //support: 0.3,
          utility: 0.3
        }
      }
    }
  }
}