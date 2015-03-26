module Rance
{
  export class AttitudeModifier
  {
    type: string;
    startTurn: number;
    endTurn: number;
    strength: number;

    constructor(type: string)
    {

    }

    getFreshness(currentTurn: number)
    {
      if (this.endTurn < 0) return 1;
      else
      {
        return 1 - getRelativeValue(currentTurn, this.startTurn, this.endTurn);
      }
    }
  }
}
