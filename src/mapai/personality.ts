module Rance
{
  export interface IPersonalityData
  {
    expansiveness: number;
    aggressiveness: number;
  }
  export class Personality implements IPersonalityData
  {
    expansiveness: number;
    aggressiveness: number;
    
    constructor(personalityData: IPersonalityData)
    {
      for (var property in personalityData)
      {
        this[property] = personalityData[property];
      }
    }
  }
}