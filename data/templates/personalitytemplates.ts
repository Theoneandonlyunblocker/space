module Rance
{
  export interface IPersonalityData
  {
    expansiveness: number;
    aggressiveness: number;

    unitCompositionPreference:
    {
      [archetype: string]: number;
    };
  }
  export module Templates
  {
    export module Personalities
    {
      export var testPersonality1: IPersonalityData =
      {
        expansiveness: 1,
        aggressiveness: 0.6,

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